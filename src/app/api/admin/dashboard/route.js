// src/app/api/admin/dashboard/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import User from '@/models/User';
import Order from '@/models/Order';
import Website from '@/models/Website';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
  try {
    // Authenticate user
    const session = await authenticate(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Get admin dashboard data
    const [users, orders, websites] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(10),
      Order.find().sort({ createdAt: -1 }).limit(10),
      Website.find().sort({ createdAt: -1 }).limit(10)
    ]);
    
    // Calculate stats
    const stats = {
      totalUsers: await User.countDocuments(),
      totalOrders: await Order.countDocuments(),
      totalWebsites: await Website.countDocuments(),
      totalRevenue: (await Order.find({ paymentStatus: 'paid' }))
        .reduce((sum, order) => sum + (order.price || 0), 0),
      pendingOrders: await Order.countDocuments({ 
        status: { $nin: ['completed', 'cancelled'] } 
      }),
      activeSubscriptions: await User.countDocuments({
        'subscription.status': 'active'
      })
    };
    
    return NextResponse.json({
      success: true,
      stats,
      recentUsers: users,
      recentOrders: orders
    });
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
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