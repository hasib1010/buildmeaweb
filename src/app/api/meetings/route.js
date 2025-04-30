// src/app/api/meetings/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import Meeting from '@/models/Meeting';
import dbConnect from '@/lib/dbConnect';

// Get all meetings for the authenticated user
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
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');
    const limit = searchParams.get('limit') || 10;
    
    // Build query
    const query = { user: session.userId };
    
    // If upcoming=true, only get future meetings
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    
    // Get meetings
    const meetings = await Meeting.find(query)
      .sort({ date: 1 })
      .limit(parseInt(limit));
    
    return NextResponse.json({
      success: true,
      meetings
    });
    
  } catch (error) {
    console.error('Get meetings error:', error);
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

// Create a new meeting
export async function POST(request) {
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
    
    // Get request body
    const requestBody = await request.json();
    
    // Validate required fields
    if (!requestBody.title || !requestBody.date || !requestBody.duration) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create meeting
    const meeting = new Meeting({
      user: session.userId,
      title: requestBody.title,
      date: new Date(requestBody.date),
      duration: requestBody.duration,
      developer: requestBody.developer || 'Assigned Developer',
      status: 'scheduled',
      type: requestBody.type || 'other',
      notes: requestBody.notes || '',
      relatedOrder: requestBody.orderId || null,
      relatedWebsite: requestBody.websiteId || null
    });
    
    // Save meeting
    await meeting.save();
    
    return NextResponse.json({
      success: true,
      meeting
    });
    
  } catch (error) {
    console.error('Create meeting error:', error);
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