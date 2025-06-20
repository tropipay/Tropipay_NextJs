"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui"
import ProfileStore from "@/stores/ProfileStore"
import { UserBusinessAccount } from "@/types/security/userAccounts"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { Check, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { NavUserBusinessAccount } from "./NavUserBusinessAccount"

interface Props {
  data?: UserBusinessAccount[]
}

export const NavUserBusiness = ({ data }: Props) => {
  const userId = (ProfileStore?.getProfileData() as any)?.id

  const [userBusinessAccountSelectedId, setUserBusinessAccountSelectedId] =
    useState<string>(
      CookiesManager.getInstance().get(
        `accountNumber-${userId}`,
        data?.[0]?.accountNumber.toString() ?? "0"
      )
    )

  const userBusinessAccountSelected = data?.find(
    ({ accountNumber }) => accountNumber === userBusinessAccountSelectedId
  )

  const onSelectUserBusinessAccount = (accountNumber: string) => {
    setUserBusinessAccountSelectedId(accountNumber)

    CookiesManager.getInstance().set(
      `accountNumber-${userId}`,
      accountNumber.toString()
    )
  }

  useEffect(() => {
    data?.[0] && onSelectUserBusinessAccount(data[0].accountNumber)
  }, [data])

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
                  key={userBusinessAccount.accountNumber}
                  onClick={() =>
                    onSelectUserBusinessAccount(
                      userBusinessAccount.accountNumber
                    )
                  }
                >
                  <NavUserBusinessAccount
                    asContext
                    {...{ userBusinessAccount }}
                  />
                  {userBusinessAccount.accountNumber ===
                    userBusinessAccountSelected?.accountNumber && <Check />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSub>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SquarePlus />
              <FormattedMessage id="add_account" />
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
