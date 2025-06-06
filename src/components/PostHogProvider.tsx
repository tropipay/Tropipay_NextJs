"use client"

import { env } from "@/config/env"
import { isProduction } from "@/utils/utils"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect, useState } from "react"

// Define options
const postHogOptions = {
  enabled: isProduction(),
  key: env.POSTHOG_KEY,
  options: {
    api_host: env.POSTHOG_HOST,
    autocapture: false,
    capture_pageview: true,
    disable_session_recording: true,
    disable_performance_metrics: true,
  },
}

export function PostHogInsert({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (
      postHogOptions.enabled &&
      typeof window !== "undefined" &&
      postHogOptions.key &&
      postHogOptions.options.api_host &&
      !isInitialized
    ) {
      try {
        posthog.init(postHogOptions.key, postHogOptions.options)
        setIsInitialized(true)
      } catch (error) {
        console.error("PostHog initialization failed:", error)
      }
    }
  }, [isInitialized])

  if (!postHogOptions.enabled || !isInitialized) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export default PostHogInsert
