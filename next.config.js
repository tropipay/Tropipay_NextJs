/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    TROPIPAY_HOME: process.env.NEXT_PUBLIC_TROPIPAY_HOME,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    V3_ACCESS_MODE: process.env.NEXT_PUBLIC_V3_ACCESS_MODE,
    POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  reactStrictMode: false,
}

module.exports = nextConfig
