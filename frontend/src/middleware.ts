import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected route patterns and required roles (if any)
const protectedRoutes = ['/dashboard'];

// The same JWT secret logic
const getJwtSecret = () => {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'nexushub-jwt-secret-change-in-production'
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If user visits /auth/login or /auth/signup, redirect to home
  if (pathname === '/auth/login' || pathname === '/auth/signup') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if current route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const sessionToken = request.cookies.get('nexushub-session')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Server-side verification
      const { payload } = await jwtVerify(sessionToken, getJwtSecret());
      
      // If valid, pass user metadata to request headers for downstream server components
      const response = NextResponse.next();
      response.headers.set('x-user-id', (payload.userId as string) || '');
      response.headers.set('x-user-role', (payload.role as string) || '');
      response.headers.set('x-user-email', (payload.email as string) || '');
      return response;
    } catch {
      // Expired or invalid token
      const redirectResponse = NextResponse.redirect(new URL('/', request.url));
      redirectResponse.cookies.set('nexushub-session', '', { maxAge: 0, path: '/' });
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/signup'],
};
