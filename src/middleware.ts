import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "./auth"
import { getTokenFromSession } from "./lib/utilsUser"

// Specify protected and public routes
const publicRoutes = ["/"]

export async function middleware(req: NextRequest) {
  const session = await auth()

  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isProtectedRoute = !isPublicRoute

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  // Redirect to /dashboard if the user is authenticated
  // if (
  //   isPublicRoute &&
  //   session &&
  //   !req.nextUrl.pathname.startsWith("/dashboard")
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  // }

  // Access to the requested route is permitted
  const requestHeaders = new Headers(req.headers)
  const cookie = (await cookies()).get("session")?.value
  const token = getTokenFromSession(cookie)
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.png).*)",
  ],
}
