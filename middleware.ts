import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export const runtime = "nodejs";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"];

  if (publicRoutes.includes(pathname)) {
    // If user is already logged in and tries to access login/register/landing, redirect to appropriate dashboard
    if (token && verifyToken(token) && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
      const decoded = verifyToken(token);
      const redirectPath = decoded?.role === "admin" ? "/dashboard-admin" : "/dashboard/tables";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard-admin")) {
    const verified = verifyToken(token || "");
    if (!token || !verified) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin routes protection
    if (pathname.startsWith("/dashboard-admin")) {
      const decoded = verifyToken(token);
      if (decoded?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/tables", request.url));
      }
    }
    
    // Redirect /dashboard root to /dashboard/tables for regular users
    if (pathname === "/dashboard") {
      const decoded = verifyToken(token);
      if (decoded?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/tables", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard-admin/:path*", "/login", "/register", "/"],
};
