// app/api/admin/orders/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Authenticate request and verify admin
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const plan = searchParams.get('plan');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    if (plan) {
      query.plan = plan;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Search by email or website name
    if (search) {
      // First look up users by email
      const users = await User.find({
        email: { $regex: search, $options: 'i' }
      });
      
      const userIds = users.map(user => user._id);
      
      // Then include website name search
      query.$or = [
        { user: { $in: userIds } },
        { 'requirements.websiteName': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Fetch orders with pagination
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
    
    // Calculate stats
    const stats = {
      totalOrders: total,
      pendingOrders: await Order.countDocuments({ status: 'pending' }),
      completedOrders: await Order.countDocuments({ status: 'completed' }),
      inProgressOrders: await Order.countDocuments({ 
        status: { $in: ['requirements', 'design', 'development', 'revision'] } 
      }),
      totalRevenue: await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]).then(result => result[0]?.total || 0),
      monthlyRevenue: await Order.aggregate([
        { 
          $match: { 
            paymentStatus: 'paid',
            createdAt: { 
              $gte: new Date(new Date().setDate(1)) // First day of current month
            }
          } 
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]).then(result => result[0]?.total || 0)
    };
    
    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order._id,
        user: {
          id: order.user._id,
          name: order.user.name,
          email: order.user.email
        },
        websiteName: order.requirements.websiteName,
        plan: order.plan,
        price: order.price,
        status: order.status,
        paymentStatus: order.paymentStatus,
        progress: order.progress,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })),
      stats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
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