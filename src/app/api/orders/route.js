// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import Order from '@/models/Order';
import User from '@/models/User';
import Website from '@/models/Website';
import dbConnect from '@/lib/dbConnect';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Configure S3 client (for file uploads)
const s3Client = process.env.AWS_ACCESS_KEY_ID ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}) : null;

/**
 * Create a new order
 */
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
    
    let data;
    let files = [];
    let uploadedFiles = [];
    
    // Check if this is a FormData request (with files)
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Get the JSON data
      const orderDataJson = formData.get('orderData');
      if (!orderDataJson) {
        return NextResponse.json(
          { success: false, message: 'Missing order data' },
          { status: 400 }
        );
      }
      
      // Parse the JSON data
      data = JSON.parse(orderDataJson);
      
      // Process files
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file-') && value instanceof File) {
          files.push({
            name: value.name,
            type: value.type,
            size: value.size,
            file: value
          });
        }
      }
      
      // Upload files to S3 if configured
      if (s3Client && files.length > 0) {
        for (const file of files) {
          try {
            const fileBuffer = await file.file.arrayBuffer();
            const fileName = `orders/${session.userId}/${uuidv4()}-${file.name}`;
            
            const uploadParams = {
              Bucket: process.env.AWS_S3_BUCKET,
              Key: fileName,
              Body: Buffer.from(fileBuffer),
              ContentType: file.type,
            };
            
            await s3Client.send(new PutObjectCommand(uploadParams));
            
            uploadedFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
            });
          } catch (error) {
            console.error('File upload error:', error);
            // Continue with other files even if one fails
          }
        }
      } else {
        // Just record file metadata if S3 is not configured
        uploadedFiles = files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }));
      }
    } else {
      // Regular JSON request
      data = await request.json();
    }
    
    // Validate required fields
    if (!data.template || !data.plan || !data.requirements?.websiteName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Set price based on plan if not provided
    let price;
    if (typeof data.price === 'number') {
      price = data.price;
    } else if (data.price === 'Custom' || data.plan === 'custom') {
      price = null; // Custom price to be determined
    } else {
      // Default prices
      if (data.plan === 'starter') price = 150;
      else if (data.plan === 'growth') price = 499;
      else if (data.plan === 'elite') price = 999;
      else price = 0;
    }
    
    // Create order
    const order = new Order({
      user: session.userId,
      plan: data.plan,
      price: price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: data.paymentMethod || 'card', // Default
      template: data.template,
      addOns: data.addOns || [],
      customRequest: data.customRequest || '',
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      requirements: {
        websiteName: data.requirements.websiteName,
        description: data.requirements.description || '',
        requiredPages: data.requirements.requiredPages || '',
        preferredColors: data.requirements.preferredColors || '',
        references: data.requirements.references || '',
        businessType: data.requirements.businessType || '',
        targetAudience: data.requirements.targetAudience || '',
        competitorWebsites: data.requirements.competitorWebsites || '',
        contactInfo: {
          name: data.requirements.contactInfo?.name || session.name,
          email: data.requirements.contactInfo?.email || session.email,
          phone: data.requirements.contactInfo?.phone || ''
        }
      },
      // Set delivery date based on plan
      estimatedDeliveryDate: new Date(
        Date.now() + 
        (data.plan === 'starter' ? 14 : data.plan === 'growth' ? 21 : 30) * 
        24 * 60 * 60 * 1000
      )
    });
    
    // Save order to database
    await order.save();
    
    // Return success with order data
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order
    });
    
  } catch (error) {
    console.error('Create order error:', error);
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

/**
 * Get order(s)
 */
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, get single order
    if (id) {
      const order = await Order.findById(id);
      
      // Check if order exists
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is authorized to view this order
      if (order.user.toString() !== session.userId.toString() && session.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Not authorized to view this order' },
          { status: 403 }
        );
      }
      
      return NextResponse.json({
        success: true,
        order
      });
    }
    
    // Get all orders for the user (or all orders for admin)
    const query = session.role === 'admin' ? {} : { user: session.userId };
    
    // Get additional query params
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Order.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      orders,
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

/**
 * Update an order
 */
export async function PUT(request) {
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
    
    // Get request data
    const data = await request.json();
    
    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Get order
    const order = await Order.findById(data.id);
    
    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to update this order
    // Only admin or the owner can update
    if (order.user.toString() !== session.userId.toString() && session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update this order' },
        { status: 403 }
      );
    }
    
    // Define fields that can be updated
    const updatableFields = [
      'status', 
      'paymentStatus', 
      'progress',
      'adminNotes',
      'estimatedDeliveryDate'
    ];
    
    // Additional fields that only admin can update
    const adminFields = [
      'price',
      'plan',
      'paymentMethod'
    ];
    
    // Update allowed fields
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        order[field] = data[field];
      }
    });
    
    // Update admin fields if user is admin
    if (session.role === 'admin') {
      adminFields.forEach(field => {
        if (data[field] !== undefined) {
          order[field] = data[field];
        }
      });
      
      // Handle requirements updates
      if (data.requirements) {
        Object.keys(data.requirements).forEach(key => {
          if (key !== 'contactInfo') {
            order.requirements[key] = data.requirements[key];
          }
        });
        
        // Handle contact info updates
        if (data.requirements.contactInfo) {
          Object.keys(data.requirements.contactInfo).forEach(key => {
            order.requirements.contactInfo[key] = data.requirements.contactInfo[key];
          });
        }
      }
    }
    
    // Add timeline event if status changed
    if (data.status && data.status !== order.status) {
      order.timeline.push({
        status: data.status,
        date: new Date(),
        message: data.timelineMessage || `Order status changed to ${data.status}`
      });
    }
    
    // Save updated order
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
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

/**
 * Delete an order
 */
export async function DELETE(request) {
  try {
    // Authenticate user
    const session = await authenticate(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only admin can delete orders
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete orders' },
        { status: 403 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Get order
    const order = await Order.findById(id);
    
    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Delete order
    await Order.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete order error:', error);
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