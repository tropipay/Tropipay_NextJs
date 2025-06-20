import IntlWrapper from "@/components/intl/Wrapper"
import PostHogInsert from "@/components/providers/PostHogProvider" // Import PostHogInsert (using the new name)
import TanstackProvider from "@/components/providers/TanstackProvider"
import { ReduxProvider } from "@/components/providers/ReduxProvider" // Import ReduxProvider
import { cn } from "@/utils/data/utils"
import type { Metadata } from "next"
import { Poppins, Roboto } from "next/font/google"
import { Suspense } from "react"
import { PublicEnvScript } from 'next-runtime-env';
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
  weight: ["400", "500", "600"], // regular y medium (en lugar de semibold)
  // O si prefieres que sea más bold: weight: ['400', '700']
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body className={cn(poppins.variable, roboto.variable, "antialiased")}>
        <Suspense>
          <PostHogInsert>
            <ReduxProvider>
              <IntlWrapper>
                <TanstackProvider>{children}</TanstackProvider>
              </IntlWrapper>
            </ReduxProvider>
          </PostHogInsert>
        </Suspense>
      </body>
    </html>
  )
}
