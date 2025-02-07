"use client"

import { sideBarOptions } from "@/app/data/sideBarOptions"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import * as React from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={sideBarOptions} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
