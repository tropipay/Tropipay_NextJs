"use client"

import { getSession } from "@/app/actions/sessionActions"
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
  const [user, setUser] = React.useState<UserSession>()

  const setUserSession = async () => {
    const session = await getSession()
    if (session) {
      setUser(session.user)
    }
  }

  React.useEffect(() => {
    setUserSession()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser {...{ user }} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={sideBarOptions} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
