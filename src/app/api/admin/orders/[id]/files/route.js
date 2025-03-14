// app/api/admin/orders/[id]/files/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Upload files to an order (admin only)
export async function POST(request, { params }) {
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
    
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 }
      );
    }
    
    // Find order
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Process the multipart form data
    const formData = await request.formData();
    
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Get file details
    const fileType = formData.get('fileType') || 'other';
    const fileDescription = formData.get('description') || '';
    
    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'orders', id);
    await writeFile(
      path.join(uploadDir, uniqueFilename),
      buffer
    );
    
    // Create file URL
    const fileUrl = `/uploads/orders/${id}/${uniqueFilename}`;
    
    // Add file to order's deliveredFiles
    order.deliveredFiles.push({
      name: file.name,
      url: fileUrl,
      type: fileType,
      description: fileDescription,
      uploadedAt: new Date()
    });
    
    // Add timeline event for file upload
    order.timeline.push({
      status: order.status,
      date: new Date(),
      message: `File uploaded: ${file.name}`
    });
    
    // If this is the first file upload, update status to revision if it's currently in development
    if (order.status === 'development' && order.deliveredFiles.length === 1) {
      order.status = 'revision';
    }
    
    // Save changes
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        url: fileUrl,
        type: fileType,
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
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

// Get files for an order
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
    
    // Find order
    const order = await Order.findOne(query);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      files: order.deliveredFiles
    });
  } catch (error) {
    console.error('Get files error:', error);
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