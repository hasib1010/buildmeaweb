import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

// Create JWT token for a user (now includes role in the token)
export const createToken = async (userId) => {
  // Fetch the user to get their role
  const user = await User.findById(userId).select('role');

  return jwt.sign({
    id: userId,
    role: user.role // Include role in the token
  }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Set JWT token in cookies
export const setTokenCookie = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
  });
};

// Get session from request
export const getSession = async (request) => {
  try {
    // Get token from cookies or authorization header
    let token;

    // Check cookies first - with await
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (tokenCookie) {
      token = tokenCookie.value;
    } else if (request?.headers?.get('authorization')) {
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
    return null;
  }

  return session;
};

// Helper to authorize certain roles
export const authorize = (session, roles) => {
  if (!session || !roles.includes(session.role)) {
    return false;
  }
  return true;
};