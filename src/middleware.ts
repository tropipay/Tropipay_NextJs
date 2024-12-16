import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getTokenFromSession } from "./lib/utilsUser"

// Specify protected and public routes
const protectedRoutes = ["/dashboard"]
const publicRoutes = ["/login"]

export async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value
  const token = getTokenFromSession(cookie)

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect to /dashboard if the user is authenticated
  // if (
  //   isPublicRoute &&
  //   token &&
  //   !req.nextUrl.pathname.startsWith("/dashboard")
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  // }

  // Access to the requested route is permitted
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
