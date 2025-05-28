import { env } from "@/config/env"
import { isTokenExpired } from "@/utils/data/utils"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "./auth"

// Specify protected and public routes
const publicRoutes = ["/"]
const systemRoutes = ["/dashboard"]

/**
 * Returns the route to redirect after authentication in Tropipay.
 * If it is not a system route, it returns the base route or origin of the application.
 * @param path middleware next request path.
 * @param origin Application origin.
 */
const getRedirectRoute = (path: string, origin: string) =>
  systemRoutes.some((route) => path.startsWith(route))
    ? `${origin}?redirect=${path}`
    : origin

export async function middleware(req: NextRequest) {
  const session = await auth()
  const token = session?.user.token

  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isProtectedRoute = !isPublicRoute

  if (isProtectedRoute && isTokenExpired(token)) {
    return NextResponse.redirect(
      new URL(
        `${env.TROPIPAY_HOME}/login?redirect=${getRedirectRoute(
          req.nextUrl.pathname,
          env.SITE_URL ?? req.nextUrl.origin
        )}`,
        req.nextUrl
      )
    )
  }

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
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
    "/((?!_next/static|_next/image|favicon.png|favicon*.png).*)",
  ],
}
