// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Condición 1: Redirigir a /login si se intenta acceder a /dashboard sin autenticación
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Condición 2: Redirigir a /dashboard si el usuario autenticado intenta acceder a otras rutas
  if (!pathname.startsWith("/dashboard") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Si no se cumple ninguna condición, se permite el acceso a la ruta solicitada
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Aplica a todas las rutas dentro de /dashboard
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Aplica a todas las rutas, excluyendo las mencionadas
  ],
}
