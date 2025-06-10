/** @type {import('next').NextConfig} */
import { env as envRuntime } from 'next-runtime-env';
const nextConfig = {
  output: "standalone",
  env: {
    API_URL: envRuntime('NEXT_PUBLIC_API_URL'),
    TROPIPAY_HOME: envRuntime('NEXT_PUBLIC_TROPIPAY_HOME'),
    SITE_URL: envRuntime('NEXT_PUBLIC_SITE_URL'),
    V3_ACCESS_MODE: envRuntime('NEXT_PUBLIC_V3_ACCESS_MODE'),
    POSTHOG_KEY: envRuntime('NEXT_PUBLIC_POSTHOG_KEY'),
    POSTHOG_HOST: envRuntime('NEXT_PUBLIC_POSTHOG_HOST'),
  },
  reactStrictMode: false,
}

module.exports = nextConfig
