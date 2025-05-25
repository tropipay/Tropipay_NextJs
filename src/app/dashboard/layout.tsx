"use client"

import { AppSidebar } from "@/components/AppSidebar"
import CookieMonitor from "@/components/CookieMonitor"
import DynamicBreadcrumb from "@/components/privateLayout/DynamicBreadcrumb"
import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui"
import { Toaster } from "@/components/ui/Toaster"
import { env } from "@/config/env"
import ProfileStore from "@/stores/ProfileStore"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Page({ children }: ChildrenProps) {
  const [withProfile, setWithProfile] = useState(false)
  const listener = (obj) => {
    const actions = {
      USER_PROFILE_OK: (obj) => {
        setWithProfile(true)
      },
    }
    actions[obj.type] && actions[obj.type](obj)
  }

  useEffect(() => {
    const unsuscriber = ProfileStore.listen(listener)
    ProfileStore.FetchProfile()
    return () => {
      unsuscriber()
    }
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
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
}
