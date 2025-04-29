import { PostHog } from "posthog-js"

export const isProduction = (): boolean => {
  if (typeof window !== "undefined") {
    return window.location.hostname === "business.tropipay.com"
  }
  // Default to false if window is not defined (e.g., during SSR)
  return false
}

export const callPosthog = (
  posthogInstance: PostHog | null, // Allow null in case PostHog is not initialized
  eventName: string,
  properties?: Record<string, any>
): void => {
  if (!posthogInstance) {
    console.warn("PostHog instance not available for event:", eventName)
    return
  }

  if (!isProduction()) {
    console.log(`[PostHog Event]: ${eventName}`, properties || {})
  }

  posthogInstance.capture(eventName, properties)
}
