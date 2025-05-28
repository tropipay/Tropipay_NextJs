"use client"

import { useRouter } from "next/navigation"
import { ChevronsUpDown, LogOut } from "lucide-react"
import { logout } from "@/app/actions/sessionActions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui"
import { FormattedMessage } from "react-intl"
import Cookies from "js-cookie"
import { NavUserAccount } from "./NavUserAccount"

export const getBaseDomain = () => {
  const hostname = window.location.hostname
  const parts = hostname.split(".")
  return "." + parts.slice(-2).join(".")
}

export function NavUser(props: any) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const user = props.user
  const onExit = async () => {
    await logout()
    Cookies.remove("session", { path: "/", domain: getBaseDomain() })
    router.push("/")
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
              {user && (
                <>
                  <NavUserAccount {...{ user }} />
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user && <NavUserAccount {...{ user }} />}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExit}>
              <LogOut />
              <FormattedMessage id="exit" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
