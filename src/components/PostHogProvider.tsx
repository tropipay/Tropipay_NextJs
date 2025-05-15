"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { ReactNode } from "react"

// Use standard Next.js environment variables
import { env } from "@/config/env"
const postHogKey = env.POSTHOG_KEY
const postHogHost = env.POSTHOG_HOST
const postHogEnabled = false

// Define options
const postHogOptions = {
  api_host: postHogHost,
  autocapture: false,
  capture_pageview: false,
  disable_session_recording: true,
  disable_performance_metrics: true,
}

export function PostHogInsert({ children }: { children: ReactNode }) {
  if (
    postHogEnabled &&
    typeof window !== "undefined" &&
    postHogKey &&
    postHogHost
  ) {
    posthog.init(postHogKey, postHogOptions)
    return <PHProvider client={posthog}>{children}</PHProvider>
  } else {
    return <>{children}</>
  }
}

export default PostHogInsert
