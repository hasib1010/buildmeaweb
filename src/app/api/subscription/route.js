// app/api/subscription/route.js
import { NextResponse } from 'next/server';

// This would typically connect to a database
// For now, we'll simulate database operations
const subscriptions = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone,
      paymentMethod,
      paymentDetails 
    } = body;
    
    // Validate required fields
    if (!customerName || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required information' },
        { status: 400 }
      );
    }
    
    // Check for existing subscription (would be a database query in real app)
    const existingSubscription = subscriptions.find(
      s => s.customerEmail === customerEmail && s.status === 'active'
    );
    
    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        subscription: existingSubscription,
        message: 'You already have an active subscription'
      });
    }
    
    // Process subscription payment (simulated)
    // In a real app, you would use Stripe or another payment processor
    // to set up recurring billing
    const paymentSuccessful = processSubscriptionPayment(paymentMethod, paymentDetails);
    
    if (!paymentSuccessful) {
      return NextResponse.json(
        { success: false, message: 'Subscription payment processing failed' },
        { status: 400 }
      );
    }
    
    // Create subscription
    const subscriptionId = `SUB-${Date.now().toString().slice(-6)}`;
    const newSubscription = {
      id: subscriptionId,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      plan: 'elite',
      price: 9.99,
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: getNextBillingDate(),
      createdAt: new Date().toISOString()
    };
    
    // Save subscription (would normally go to database)
    subscriptions.push(newSubscription);
    
    // Return success
    return NextResponse.json({
      success: true,
      subscription: newSubscription,
      message: 'Subscription created successfully!'
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your subscription' },
      { status: 500 }
    );
  }
}

// Simulated subscription payment processing
function processSubscriptionPayment(paymentMethod, paymentDetails) {
  // This is just a simulation - in a real app, you would:
  // 1. Integrate with a payment processor like Stripe for recurring billing
  // 2. Validate payment details
  // 3. Set up the subscription in the payment processor
  
  // Always succeed for now
  return true;
}

// Calculate next billing date (1 month from now)
function getNextBillingDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

// GET endpoint to check subscription status
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email is required' },
      { status: 400 }
    );
  }
  
  // Find the subscription (would normally query database)
  const subscription = subscriptions.find(
    s => s.customerEmail === email && s.status === 'active'
  );
  
  if (!subscription) {
    return NextResponse.json({
      success: false,
      hasSubscription: false,
      message: 'No active subscription found'
    });
  }
  
  return NextResponse.json({
    success: true,
    hasSubscription: true,
    subscription
  });
}

// PUT endpoint to cancel subscription
export async function PUT(request) {
  try {
    const body = await request.json();
    const { subscriptionId, action } = body;
    
    if (!subscriptionId || !action) {
      return NextResponse.json(
        { success: false, message: 'Subscription ID and action are required' },
        { status: 400 }
      );
    }
    
    // Find subscription index
    const subscriptionIndex = subscriptions.findIndex(s => s.id === subscriptionId);
    
    if (subscriptionIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    if (action === 'cancel') {
      // Update the subscription
      subscriptions[subscriptionIndex] = {
        ...subscriptions[subscriptionIndex],
        status: 'canceled',
        cancelDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        subscription: subscriptions[subscriptionIndex],
        message: 'Subscription canceled successfully'
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the subscription' },
      { status: 500 }
    );
  }
}