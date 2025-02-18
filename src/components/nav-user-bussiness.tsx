"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import CookiesManager from "@/lib/cookiesManager"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { Check, ChevronsUpDown, SquarePlus } from "lucide-react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { NavUserBusinessAccount } from "./nav-user-bussiness-account"

interface Props {
  data?: UserBusinessAccount[]
}

export const NavUserBusiness = ({ data }: Props) => {
  // const dataMocked = accounts
  const [userBusinessAccountSelectedId, setUserBusinessAccountSelectedId] =
    useState<number>(
      +CookiesManager.getInstance().get(
        "userAccountId",
        data?.[0]?.id.toString() ?? "0"
      )
    )

  const userBusinessAccountSelected = data?.find(
    ({ id }) => id === userBusinessAccountSelectedId
  )

  const onSelectUserBusinessAccount = (id: number) => {
    setUserBusinessAccountSelectedId(id)
    CookiesManager.getInstance().set("userAccountId", id.toString())
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userBusinessAccountSelected && (
                <>
                  <NavUserBusinessAccount
                    {...{ userBusinessAccount: userBusinessAccountSelected }}
                  />
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-1 pl-2 text-sm text-gray-500">
              <FormattedMessage id="accounts" />
            </DropdownMenuLabel>
            <DropdownMenuSub>
              {data?.map((userBusinessAccount) => (
                <DropdownMenuItem
                  key={userBusinessAccount.id}
                  onClick={() =>
                    onSelectUserBusinessAccount(userBusinessAccount.id)
                  }
                >
                  <NavUserBusinessAccount
                    asContext
                    {...{ userBusinessAccount }}
                  />
                  {userBusinessAccount.id ===
                    userBusinessAccountSelected?.id && <Check />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SquarePlus />
              <FormattedMessage id="add_account" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
