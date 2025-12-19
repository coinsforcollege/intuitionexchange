import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/overview',
  '/dashboard',
  '/trade',
  '/buy-sell',
  // '/markets' - accessible publicly with limited functionality
  '/portfolio',
  '/transactions',
  '/settings',
  '/p2p',
];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/register', '/reset'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies
  const token = request.cookies.get('authToken')?.value;
  
  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if it's an auth route (login, register, etc.)
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Prevent caching of redirect responses (fixes prefetch cache poisoning after login)
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // If trying to access auth routes while logged in, redirect to dashboard
  if (isAuthRoute && token) {
    const response = NextResponse.redirect(new URL('/overview', request.url));
    // Prevent caching of redirect responses
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)' 
  ],
};

