// app/api/admin/orders/[id]/status/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Update order status (admin only)
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
    
    // Parse request body
    const body = await request.json();
    const { status, message, notifyCustomer, estimatedDeliveryDate } = body;
    
    // Validate status
    const validStatuses = ['pending', 'requirements', 'design', 'development', 'revision', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Find order with user details
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update order status
    order.status = status;
    
    // Add custom message to timeline if provided
    if (message) {
      order.timeline.push({
        status,
        date: new Date(),
        message
      });
    }
    
    // Update estimated delivery date if provided
    if (estimatedDeliveryDate) {
      order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
    }
    
    // Save changes
    await order.save();
    
    // Notify customer if requested
    if (notifyCustomer && order.user && order.user.email) {
      // Status-specific subject lines
      const subjectLines = {
        'requirements': 'Action Required: Requirements Needed for Your Website Order',
        'design': 'Update: Design Phase Started for Your Website',
        'development': 'Update: Development Phase Started for Your Website',
        'revision': 'Action Required: Review Your Website and Provide Feedback',
        'completed': 'Great News! Your Website is Now Complete',
        'cancelled': 'Important: Update About Your Website Order'
      };
      
      const subject = subjectLines[status] || `Update: Your Website Order Status is Now ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Website Order Update</h1>
          </div>
          <div style="background: #1f2937; padding: 20px; color: #e5e7eb; border-radius: 0 0 8px 8px;">
            <p>Hi ${order.user.name},</p>
            <p>Your website order for <strong>${order.requirements.websiteName}</strong> has been updated.</p>
            <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            
            ${message ? `<p><strong>Message from our team:</strong> ${message}</p>` : ''}
            
            ${estimatedDeliveryDate ? `<p><strong>Estimated delivery date:</strong> ${new Date(estimatedDeliveryDate).toLocaleDateString()}</p>` : ''}
            
            <div style="margin: 25px 0; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" style="background: linear-gradient(to right, #0ea5e9, #8b5cf6); color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">View Order Details</a>
            </div>
            
            <p>If you have any questions, please reply to this email or contact our support team.</p>
            
            <p>Thank you for choosing our website building service!</p>
            
            <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;" />
            
            <p style="text-align: center; font-size: 12px; color: #9ca3af;">
              WebBuilder | © ${new Date().getFullYear()}
            </p>
          </div>
        </div>
      `;
      
      await transporter.sendMail({
        from: `"WebBuilder Team" <${process.env.EMAIL_FROM}>`,
        to: order.user.email,
        subject,
        html: emailContent,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        status: order.status,
        progress: order.progress,
        updatedAt: order.updatedAt,
        estimatedDeliveryDate: order.estimatedDeliveryDate
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
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