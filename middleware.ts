import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated = request.cookies.get("auth")?.value === "true"

  // If trying to access admin pages without authentication
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/rewards") ||
    request.nextUrl.pathname.startsWith("/fondomats") ||
    request.nextUrl.pathname.startsWith("/control")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // If authenticated user tries to access login page, redirect to dashboard
  if (request.nextUrl.pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/rewards/:path*", "/fondomats/:path*", "/control/:path*", "/login"],
}
