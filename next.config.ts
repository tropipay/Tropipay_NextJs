import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api2/:path*",
        destination: "https://tropipay-dev.herokuapp.com/api/:path*",
      },
    ]
  },
}

export default nextConfig
