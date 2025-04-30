import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email not verified. Please verify your email before logging in.',
          requiresVerification: true,
          email: user.email
        },
        { status: 403 }
      );
    }

    // Create token - Use await here since the function is now async
    const token = await createToken(user._id);

    // Set cookie - with await
    await setTokenCookie(token);
    
    // Log for debugging
    console.log('Login successful for user:', user.email, 'with role:', user.role);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
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