import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api2/:path*", // Intercepta todas las rutas que empiecen con /api
        destination: "http://localhost:3001/api/:path*", // Redirige a localhost:3001
      },
    ]
  },
}

export default nextConfig
