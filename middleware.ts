import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = false; // TODO: Replace with real auth check
  const { pathname } = request.nextUrl;

  // Allow login and signup pages
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from /auth-protected routes
  if (pathname.startsWith('/auth') && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
}; 