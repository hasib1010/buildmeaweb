// src/app/api/orders/payment/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbConnect';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Create payment session for an order
 */
export async function POST(request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { success: false, message: 'Payment provider not configured' },
        { status: 500 }
      );
    }
    
    // Authenticate user
    const session = await authenticate(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Get request data
    const data = await request.json();
    
    // Check if order ID is provided
    if (!data.orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Get order
    const order = await Order.findById(data.orderId);
    
    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to pay for this order
    if (order.user.toString() !== session.userId.toString() && session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to pay for this order' },
        { status: 403 }
      );
    }
    
    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, message: 'Order is already paid' },
        { status: 400 }
      );
    }
    
    // Check if price is set
    if (!order.price || order.price <= 0) {
      return NextResponse.json(
        { success: false, message: 'Order price is not set' },
        { status: 400 }
      );
    }
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${order.template.charAt(0).toUpperCase() + order.template.slice(1)} Website - ${order.plan.charAt(0).toUpperCase() + order.plan.slice(1)} Plan`,
              description: order.requirements.websiteName,
            },
            unit_amount: Math.round(order.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?id=${order.id}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?id=${order.id}&success=false`,
      metadata: {
        orderId: order.id.toString(),
        userId: session.userId.toString(),
      },
    });
    
    // Save payment intent to order
    order.paymentIntentId = checkoutSession.payment_intent;
    await order.save();
    
    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
    
  } catch (error) {
    console.error('Payment error:', error);
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