// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request) {
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query
    const query = { user: session.userId };
    if (status) {
      query.status = status;
    }
    
    // Check if user is admin to get all orders
    if (session.role === 'admin') {
      // If admin, remove user filter to get all orders
      delete query.user;
      
      // Add user email filter if provided
      const userEmail = searchParams.get('userEmail');
      if (userEmail) {
        const user = await User.findOne({ email: userEmail });
        if (user) {
          query.user = user._id;
        }
      }
    }
    
    // Fetch orders with pagination
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
    
    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
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
        requirements: order.requirements,
        progress: order.progress,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
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