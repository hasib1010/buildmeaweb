// src/app/api/auth/verify-email/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification token' },
        { status: 400 }
      );
    }
    
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with the token and token not expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpire: { $gt: Date.now() },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
    
    // Update user as verified and clear verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    
    await user.save();
    
    // Create JWT token
    const jwtToken = createToken(user._id);
    
    // Set cookie
    setTokenCookie(jwtToken);
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
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