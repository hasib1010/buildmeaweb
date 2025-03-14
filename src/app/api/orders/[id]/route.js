// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// Get a single order
export async function GET(request, { params }) {
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
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    // Build query based on role
    const query = { _id: id };
    
    // Regular users can only see their own orders
    if (session.role !== 'admin') {
      query.user = session.userId;
    }
    
    // Find order with user details
    const order = await Order.findOne(query).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        user: {
          id: order.user._id,
          name: order.user.name,
          email: order.user.email
        },
        plan: order.plan,
        price: order.price,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        requirements: order.requirements,
        progress: order.progress,
        timeline: order.timeline,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        deliveredFiles: order.deliveredFiles,
        adminNotes: session.role === 'admin' ? order.adminNotes : undefined,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
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

// Update an order (admin only for most fields, users can update certain fields)
export async function PUT(request, { params }) {
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
    
    const { id } = params;
    const body = await request.json();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    // Find order
    const query = { _id: id };
    if (session.role !== 'admin') {
      query.user = session.userId;
    }
    
    const order = await Order.findOne(query);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Determine what fields can be updated based on role
    if (session.role === 'admin') {
      // Admins can update any field
      const adminUpdatableFields = [
        'status', 'paymentStatus', 'progress', 'estimatedDeliveryDate',
        'adminNotes', 'deliveredFiles'
      ];
      
      adminUpdatableFields.forEach(field => {
        if (body[field] !== undefined) {
          order[field] = body[field];
        }
      });
      
      // Handle timeline updates
      if (body.addTimelineEvent) {
        order.timeline = order.timeline || [];
        order.timeline.push({
          status: body.addTimelineEvent.status,
          date: new Date(),
          message: body.addTimelineEvent.message
        });
      }
    } else {
      // Regular users can only update limited fields
      if (body.requirements) {
        // Allow users to update requirements if status is still pending
        if (order.status === 'pending' || order.status === 'requirements') {
          order.requirements = {
            ...order.requirements,
            ...body.requirements
          };
        } else {
          return NextResponse.json(
            { success: false, message: 'Cannot update requirements at current order stage' },
            { status: 400 }
          );
        }
      }
    }
    
    // Save updates
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: order._id,
        status: order.status,
        progress: order.progress,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Update order error:', error);
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