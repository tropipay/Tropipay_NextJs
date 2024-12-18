import IntlWrapper from "@/components/intl/wrapper"
import TanstackProvider from "@/components/TanstackProvider"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Tropipay Business",
  description: "Tropipay Business",
}

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IntlWrapper>
          <TanstackProvider>{children}</TanstackProvider>
        </IntlWrapper>
      </body>
    </html>
  )
}
