"use client"

import { sideBarOptions } from "@/app/data/sideBarOptions"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { NavUser } from "@/components/navUser/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui"
import { NavMain } from "@/components/ui/NavMain"
import { dehydrate, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import * as React from "react"
import DataComponent from "./DataComponent"
import { NavUserBusiness } from "./navUser/NavUserBusiness"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const queryConfig = apiConfig.accounts
  const dehydratedState = dehydrate(queryClient)
  const user = session?.user

  return (
    <Sidebar collapsible="icon" {...props}>
      {dehydratedState && (
        <SidebarHeader>
          <DataComponent
            {...{
              queryConfig,
              dehydratedState,
              showError: false,
              // mockData: accountsMock,
            }}
          >
            <NavUserBusiness />
          </DataComponent>
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={sideBarOptions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...{ user }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
