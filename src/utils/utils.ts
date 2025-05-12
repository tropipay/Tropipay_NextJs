import { PostHog } from "posthog-js"

/**
 * Checks if the application is running in production environment.
 * @returns {boolean} True if the application is in production, false otherwise.
 */
export const isProduction = (): boolean => {
  if (typeof window !== "undefined") {
    return window.location.hostname === "business.tropipay.com"
  }
  // Default to false if window is not defined (e.g., during SSR)
  return false
}

/**
 * Calls PostHog to capture an event.
 * @param {PostHog | null} postHogInstance - The PostHog instance.
 * @param {string} eventName - The name of the event to capture.
 * @param {Record<string, any>} [properties] - Additional properties to include with the event.
 */
export const callPostHog = (
  postHogInstance: PostHog | null, // Allow null in case PostHog is not initialized
  eventName: string,
  properties?: Record<string, any>
): void => {
  if (!postHogInstance) {
    console.warn("PostHog instance not available for event:", eventName)
    return
  }

  if (!isProduction()) {
    console.log(`[PostHog Event]: ${eventName}`, properties || {})
  }
  postHogInstance.capture(eventName, properties)
}
