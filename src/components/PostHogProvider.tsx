"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { ReactNode } from "react"

// Use standard Next.js environment variables
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

// Define options
const posthogOptions = {
  api_host: posthogHost,
  autocapture: false,
  capture_pageview: false,
  disable_session_recording: true,
  disable_performance_metrics: true,
}

export function PostHogInsert({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined" && posthogKey && posthogHost) {
    posthog.init(posthogKey, posthogOptions)
    return <PHProvider client={posthog}>{children}</PHProvider>
  } else {
    return <>{children}</>
  }
}

export default PostHogInsert
