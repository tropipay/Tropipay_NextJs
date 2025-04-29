"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { ReactNode, useEffect } from "react"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (typeof window !== "undefined" && posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false, // Disable automatic pageview capture, we'll handle it manually if needed in Next.js
  })
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  // We only wrap with the PostHog Provider if the key and host are defined
  if (!posthogKey || !posthogHost) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Optional: Component to capture page views on route changes
// You might need to integrate this differently depending on your router setup (App Router vs Pages Router)
// For App Router, you might use NavigationEvents from 'next/navigation'
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
