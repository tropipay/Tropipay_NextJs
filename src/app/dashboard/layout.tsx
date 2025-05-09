"use client"

import { AppSidebar } from "@/components/AppSidebar"
import DynamicBreadcrumb from "@/components/privateLayout/DynamicBreadcrumb"
import {
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui"
import { SessionProvider } from "next-auth/react"
import { Suspense } from "react"

export default function Page({ children }: ChildrenProps) {
  return (
    <Suspense>
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
    </Suspense>
  )
}
