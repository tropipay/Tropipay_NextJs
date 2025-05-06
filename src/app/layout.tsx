import IntlWrapper from "@/components/intl/Wrapper"
import { PostHogProvider } from "@/components/PostHogProvider" // Import PostHogProvider
import TanstackProvider from "@/components/TanstackProvider"
import { Toaster } from "@/components/ui"
import type { Metadata } from "next"
import { Poppins, Roboto } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tropipay Business",
  description: "Tropipay Business",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
  },
}

const poppins = Poppins({
  weight: ["500", "600"], // Especifica los pesos que necesites
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

// Configuración de Roboto
const roboto = Roboto({
  weight: ["400", "500"], // regular y medium (en lugar de semibold)
  // O si prefieres que sea más bold: weight: ['400', '700']
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        <Suspense>
          {/* Wrap IntlWrapper with PostHogProvider */}
          <PostHogProvider>
            <IntlWrapper>
              <Toaster />
              <TanstackProvider>{children}</TanstackProvider>
            </IntlWrapper>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
