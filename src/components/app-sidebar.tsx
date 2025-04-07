"use client"

import { sideBarOptions } from "@/app/data/sideBarOptions"
import { accountsMock } from "@/app/queryDefinitions/accounts/accountsMock"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { dehydrate, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import * as React from "react"
import DataComponent from "./DataComponent"
import { NavUserBusiness } from "./nav-user-bussiness"

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
              mockData: accountsMock,
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
