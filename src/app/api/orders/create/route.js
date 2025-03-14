// app/api/orders/create/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Authenticate request
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { 
      plan, 
      websiteName, 
      description, 
      requiredPages, 
      preferredColors, 
      references,
      contactInfo,
      paymentMethod
    } = body;
    
    // Validate required fields
    if (!plan || !websiteName) {
      return NextResponse.json(
        { success: false, message: 'Plan and website name are required' },
        { status: 400 }
      );
    }
    
    // Determine price based on plan
    let price;
    switch(plan) {
      case 'starter':
        price = 150;
        break;
      case 'growth':
        price = 499;
        break;
      case 'elite':
        price = 999; // Base price for custom plan
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid plan selected' },
          { status: 400 }
        );
    }
    
    // Get user
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe uses cents
      currency: 'usd',
      customer: user.subscription?.customerId || undefined,
      metadata: {
        plan,
        userId: user._id.toString(),
        websiteName
      },
    });
    
    // Create order in database
    const order = await Order.create({
      user: user._id,
      plan,
      price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentIntentId: paymentIntent.id,
      paymentMethod: paymentMethod || 'card',
      requirements: {
        websiteName,
        description: description || '',
        requiredPages: requiredPages || '',
        preferredColors: preferredColors || '',
        references: references || '',
        contactInfo: contactInfo || {}
      },
      estimatedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order._id,
        plan: order.plan,
        price: order.price,
        status: order.status,
        paymentStatus: order.paymentStatus,
        estimatedDeliveryDate: order.estimatedDeliveryDate
      },
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
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