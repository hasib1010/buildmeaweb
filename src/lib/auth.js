// src/lib/auth.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

// Create JWT token for a user
export const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Set JWT token in cookies
export const setTokenCookie = (token) => {
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: 'strict',
  });
};

// Get session from request
export const getSession = async (request) => {
  try {
    // Get token from cookies or authorization header
    let token;
    
    // Check cookies first
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (tokenCookie) {
      token = tokenCookie.value;
    } else if (request.headers.get('authorization')) {
      // If no cookie, check authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    // If no token found, return null
    if (!token) {
      return null;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return null;
    }
    
    // Return session data
    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscription: user.subscription,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Middleware to protect routes
export const authenticate = async (request) => {
  const session = await getSession(request);
  
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  return session;
};

// Helper to authorize certain roles
export const authorize = (session, roles) => {
  if (!roles.includes(session.role)) {
    return false;
  }
  return true;
};