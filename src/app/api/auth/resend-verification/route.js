// src/app/api/auth/resend-verification/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide an email address' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No user found with this email address' },
        { status: 404 }
      );
    }
    
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'This email is already verified' },
        { status: 400 }
      );
    }
    
    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();
    
    // Create verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin');
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    
    // Send verification email
    await sendVerificationEmail(user, verificationUrl);
    
    return NextResponse.json({
      success: true,
      message: 'Verification email resent successfully',
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
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