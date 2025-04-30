// src/app/api/webhooks/stripe/route.js
import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbConnect';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Handle Stripe webhook events
 */
export async function POST(request) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { success: false, message: 'Payment provider not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Get the request body
    const body = await request.text();
    
    // Get the signature from headers
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { success: false, message: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Find the order by payment intent ID
        const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
        
        if (order) {
          // Update order status
          order.paymentStatus = 'paid';
          
          // Add payment details
          order.paymentDetails = {
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method_type,
            paidAt: new Date(),
          };
          
          // Add to timeline
          order.timeline.push({
            status: 'payment',
            date: new Date(),
            message: 'Payment received',
          });
          
          // If order is still in pending status, move it to requirements stage
          if (order.status === 'pending') {
            order.status = 'requirements';
          }
          
          // Save order
          await order.save();
          
          // Here you could also send confirmation emails or notifications
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        
        // Find the order by payment intent ID
        const failedOrder = await Order.findOne({ paymentIntentId: failedPaymentIntent.id });
        
        if (failedOrder) {
          // Update payment status
          failedOrder.paymentStatus = 'failed';
          
          // Add to timeline
          failedOrder.timeline.push({
            status: 'payment_failed',
            date: new Date(),
            message: 'Payment failed',
          });
          
          // Save order
          await failedOrder.save();
        }
        break;
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Configure webhook route to accept raw body
export const config = {
  api: {
    bodyParser: false,
  },
};