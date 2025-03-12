// app/api/checkout/route.js
import { NextResponse } from 'next/server';

// This would typically connect to a database
// For now, we'll simulate database operations
const orders = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      planId, 
      customerName, 
      customerEmail, 
      customerPhone,
      websiteDetails,
      paymentMethod,
      paymentDetails 
    } = body;
    
    // Validate required fields
    if (!planId || !customerName || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required information' },
        { status: 400 }
      );
    }
    
    // Plan details
    const plans = {
      starter: { name: 'Starter', price: 150 },
      growth: { name: 'Growth', price: 499 },
      elite: { name: 'Elite - Custom', price: 'Custom' }
    };
    
    const selectedPlan = plans[planId];
    if (!selectedPlan) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    // Process payment (simulated)
    const paymentSuccessful = processPayment(selectedPlan, paymentMethod, paymentDetails);
    
    if (!paymentSuccessful) {
      return NextResponse.json(
        { success: false, message: 'Payment processing failed' },
        { status: 400 }
      );
    }
    
    // Create order
    const orderNumber = `WEB-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderNumber,
      planId,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      customerName,
      customerEmail,
      customerPhone,
      websiteDetails,
      paymentMethod,
      status: 'paid',
      createdAt: new Date().toISOString()
    };
    
    // Save order (would normally go to database)
    orders.push(newOrder);
    
    // Return success
    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order processed successfully!'
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}

// Simulated payment processing
function processPayment(plan, paymentMethod, paymentDetails) {
  // This is just a simulation - in a real app, you would:
  // 1. Integrate with a payment processor like Stripe
  // 2. Validate payment details
  // 3. Process the actual payment
  
  // Always succeed for now
  return true;
}

// GET endpoint to retrieve order info by ID
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    return NextResponse.json(
      { success: false, message: 'Order ID is required' },
      { status: 400 }
    );
  }
  
  // Find the order (would normally query database)
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    return NextResponse.json(
      { success: false, message: 'Order not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    order
  });
}