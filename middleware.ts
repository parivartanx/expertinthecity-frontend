import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a simplified middleware. In a real application, you would verify
// the JWT token and check the user's role from your authentication system.
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // If user is authenticated and tries to access login page, redirect to dashboard
  if (isAuthenticated && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // If user is not authenticated and tries to access admin routes, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// This is a mock function - replace with actual JWT verification
function mockCheckAdminRole(session: string): boolean {
  // In production, you would decode the JWT and check the role
  return true; // Always return true for demo purposes
}

// Match only the admin paths
export const config = {
  matcher: ["/admin/:path*", "/login"],
};