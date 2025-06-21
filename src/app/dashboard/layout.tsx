"use client"

import Spinner from "@/components/ui/spinner/Spinner"

import { AppSidebar } from "@/components/AppSidebar"
import CookieMonitor from "@/components/CookieMonitor"
import DynamicBreadcrumb from "@/components/privateLayout/DynamicBreadcrumb"
import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui"
import { Toaster } from "@/components/ui/Sonner"
import { env } from "@/config/env"
import useStoreListener from "@/hooks/useStoreListener"
import ProfileStore from "@/stores/ProfileStore"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Page({ children }: ChildrenProps) {
  const [withProfile, setWithProfile] = useState(false)

  useStoreListener([
    {
      stores: [ProfileStore],
      eventPrefix: "layout",
      actions: {
        USER_PROFILE_OK: () => setWithProfile(true),
      },
    },
  ])

  useEffect(() => {
    ProfileStore.FetchProfile()
  }, [])

  if (withProfile)
    return (
      <SessionProvider>
        <CookieMonitor
          cookieName="session"
          redirectPath={`${env.TROPIPAY_HOME}/login?redirect=${env.SITE_URL}`}
        />
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mt-1 mb-1">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicBreadcrumb />
              </div>
            </header>
            <div className="flex flex-1 px-4 pt-0">{children}</div>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </SessionProvider>
    )

  return <Spinner />
}
