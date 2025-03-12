// app/api/orders/route.js
import { NextResponse } from 'next/server';

// This would typically connect to a database
// For now, we'll use the same orders array as in checkout.js
// In a real app, these would be stored in a database
const orders = [];

// Get all orders (admin endpoint, would require authentication)
export async function GET(request) {
  // In a real app, this would require authentication/authorization
  // And would filter orders based on the authenticated user
  
  return NextResponse.json({
    success: true,
    orders
  });
}

// Update an order status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { orderId, status, notes } = body;
    
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
        { status: 400 }
      );
    }
    
    // Find order index (would be a database query in real app)
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Valid status values
    const validStatuses = [
      'paid', 
      'processing', 
      'in_review', 
      'completed', 
      'canceled'
    ];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the order
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      notes: notes || orders[orderIndex].notes,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
      message: 'Order updated successfully'
    });
    
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the order' },
      { status: 500 }
    );
  }
}

// Cancel an order
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    return NextResponse.json(
      { success: false, message: 'Order ID is required' },
      { status: 400 }
    );
  }
  
  // Find order index
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Order not found' },
      { status: 404 }
    );
  }
  
  // In a real app you might not actually delete, but mark as canceled
  // Here we're just setting status to canceled
  orders[orderIndex] = {
    ...orders[orderIndex],
    status: 'canceled',
    updatedAt: new Date().toISOString()
  };
  
  return NextResponse.json({
    success: true,
    message: 'Order canceled successfully'
  });
}