// src/middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  
  // URLs that require authentication
  const authRoutes = [
    '/dashboard',
    '/profile',
    '/orders',
    '/checkout',
  ];
  
  // Check if the requested path requires authentication
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // If visiting auth route without token, redirect to login
  if (isAuthRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting login/register with token, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};