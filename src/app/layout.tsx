import IntlWrapper from "@/components/intl/Wrapper"
import { ReduxProvider } from "@/components/ReduxProvider" // Import ReduxProvider
import TanstackProvider from "@/components/TanstackProvider"
import { Toaster } from "@/components/ui"
import type { Metadata } from "next"
import { Poppins, Roboto } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

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
  weight: ["600"], // semibold
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
        <SessionProvider>
          <Suspense>
            <ReduxProvider>
              <IntlWrapper>
                <Toaster />
                <TanstackProvider>{children}</TanstackProvider>
              </IntlWrapper>
            </ReduxProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}
