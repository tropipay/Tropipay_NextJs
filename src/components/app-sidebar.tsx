"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { getSession } from "@/app/actions/sessionActions"
import { sideBarOptions } from "@/app/data/sideBarOptions"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

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
