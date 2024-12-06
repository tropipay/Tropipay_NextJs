"use client"

import * as React from "react"
import {
  AudioWaveform,
  UsersRound,
  HandCoins,
  Command,
  GalleryVerticalEnd,
  ScrollText,
  ArrowLeftRight,
  PackagePlus,
  BadgeDollarSign,
  Store,
  CreditCard,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Movimientos",
      url: "#",
      icon: ArrowLeftRight,
      isActive: true,
      items: [
        {
          title: "Todos",
          url: "/dashboard/movements",
        },
        {
          title: "Programados",
          url: "#",
        },
        {
          title: "Disputas",
          url: "#",
        },
      ],
    },
    {
      title: "Cobros",
      url: "#",
      icon: BadgeDollarSign,
    },
    {
      title: "Beneficios",
      url: "#",
      icon: UsersRound,
    },
    {
      title: "Informes",
      url: "#",
      icon: ScrollText,
    },
    {
      title: "Proveedores ",
      url: "#",
      icon: PackagePlus,
    },
    {
      title: "Nómina",
      url: "#",
      icon: HandCoins,
    },
    {
      title: "Ficha del market",
      url: "#",
      icon: Store,
    },
    {
      title: "Terminal",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "API",
      url: "#",
      icon: SquareTerminal,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
