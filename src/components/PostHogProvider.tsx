"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { ReactNode } from "react"

// Use standard Next.js environment variables
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST // Remove default host, rely on env var being set

// Define options
const posthogOptions = {
  api_host: posthogHost,
  autocapture: false, // Explicitly disable autocapture
  capture_pageview: false, // Keep pageview capture disabled
}

// Renamed component for consistency (optional, but helps clarity)
export function PostHogInsert({ children }: { children: ReactNode }) {
  // Initialize only if key and host are provided (standard Next.js check)
  if (typeof window !== "undefined" && posthogKey && posthogHost) {
    // Initialize inside the condition and only once
    if (
      !posthog.has_opted_in_capturing() &&
      !posthog.has_opted_out_capturing()
    ) {
      posthog.init(posthogKey, posthogOptions)
      // Removed window.posthog assignment
    }
    // Use the provider directly, passing the initialized client
    // Note: posthog-js/react's PHProvider expects the client instance
    // If we wanted to pass apiKey/options like the old project, we'd need a different structure
    // or potentially stick to the old project's direct use of PostHogProvider if structure differs significantly.
    // Given the current structure uses posthog.init() first, passing the client is correct here.
    return <PHProvider client={posthog}>{children}</PHProvider>
  } else {
    // If conditions are not met (missing key/host), just render children without the provider
    return <>{children}</>
  }
}

// Keep the optional pageview component commented out for now
// import { usePathname, useSearchParams } from 'next/navigation'
// export function PostHogPageview(): null {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   useEffect(() => {
//     if (pathname && posthogKey && posthogHost) {
//       let url = window.origin + pathname
//       if (searchParams && searchParams.toString()) {
//         url = url + `?${searchParams.toString()}`
//       }
//       posthog.capture(
//         '$pageview',
//         {
//           '$current_url': url,
//         }
//       )
//     }
//   }, [pathname, searchParams])
//   return null
// }

// Export with the new name
export default PostHogInsert

// We might need to update the import in layout.tsx if the component name changed
