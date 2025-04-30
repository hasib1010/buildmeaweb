// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import User from '@/models/User';
import Order from '@/models/Order';
import Website from '@/models/Website';
import Meeting from '@/models/Meeting';
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
    
    // Connect to database
    await dbConnect();
    
    // Fetch all user data in parallel
    const [websites, orders, meetings, user] = await Promise.all([
      // Get user's websites
      Website.find({ user: session.userId }).sort({ updatedAt: -1 }),
      
      // Get user's orders
      Order.find({ user: session.userId }).sort({ createdAt: -1 }),
      
      // Get user's meetings
      Meeting.find({ 
        user: session.userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Meetings from last 30 days and future
      }).sort({ date: 1 }),
      
      // Get user details for subscription info
      User.findById(session.userId).select('subscription')
    ]);
    
    // Calculate dashboard stats
    const stats = {
      totalWebsites: websites.length,
      activeOrders: orders.filter(order => 
        !['completed', 'cancelled'].includes(order.status)
      ).length,
      upcomingMeetings: meetings.filter(meeting => 
        new Date(meeting.date) > new Date()
      ).length,
      subscription: user?.subscription?.plan || 'none'
    };
    
    // Process websites to get required format
    const processedWebsites = websites.map(website => ({
      id: website._id,
      name: website.name,
      template: website.template,
      status: website.isPublished ? 'published' : 'draft',
      lastEdited: website.updatedAt,
      url: website.domain || `${website._id}.yourplatform.com`,
      thumbnail: website.thumbnail || `/api/placeholder/300/200`
    }));
    
    // Process orders to get required format
    const processedOrders = orders.map(order => ({
      id: order._id,
      name: order.requirements.websiteName,
      plan: order.plan,
      status: order.status,
      progress: order.progress,
      orderedDate: order.createdAt,
      deliveryDate: order.estimatedDeliveryDate,
      thumbnail: `/api/placeholder/300/200`,
      timeline: order.timeline
    }));
    
    // Process meetings to get required format
    const processedMeetings = meetings.map(meeting => ({
      id: meeting._id,
      title: meeting.title,
      date: meeting.date,
      duration: meeting.duration,
      developer: meeting.developer,
      status: meeting.status,
      notes: meeting.notes
    }));
    
    return NextResponse.json({
      success: true,
      stats,
      websites: processedWebsites,
      orders: processedOrders,
      meetings: processedMeetings
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
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