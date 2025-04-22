"use client"

import { AppSidebar } from "@/components/AppSidebar"
import DynamicBreadcrumb from "@/components/privateLayout/DynamicBreadcrumb"
import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui"
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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    )
}
