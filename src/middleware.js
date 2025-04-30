import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Using jose for JWT verification in middleware

export async function middleware(request) {
  // Get token from cookie header
  const token = request.cookies.get('token');

  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Check if the user is authenticated (has a token)
  const isAuthenticated = !!token;

  // Public routes - accessible to everyone
  const publicRoutes = ['/about', '/pricing', '/contact'];

  // Auth routes - only accessible to non-authenticated users
  const authRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

  // Protected routes - only accessible to authenticated users
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/orders',
    '/create-website',
    '/checkout',
    '/order-website'
  ];

  // Admin routes - only accessible to admin users
  const adminRoutes = ['/admin'];

  // Check if user is trying to access auth routes while authenticated
  if (isAuthenticated && authRoutes.some(route => pathname === route)) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if user is trying to access protected routes while not authenticated
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Redirect to login with the intended destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is trying to access admin routes 
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    try {
      // Use jose to verify the token in middleware
      const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token.value, JWT_SECRET);

      if (payload.role !== 'admin') {
        // Not an admin, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Admin access error:', error);
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};