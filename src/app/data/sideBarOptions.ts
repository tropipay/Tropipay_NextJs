import { SidebarOption } from "@/types/sidebarOption"
import {
  ArrowLeftRight,
  BadgeDollarSign,
  CreditCard,
  HandCoins,
  PackagePlus,
  ScrollText,
  SquareTerminal,
  Store,
  UsersRound,
} from "lucide-react"

export const sideBarOptions: SidebarOption[] = [
  {
    title: "movements",
    url: "",
    icon: ArrowLeftRight,
    isActive: true,
    items: [
      {
        title: "all",
        url: "/dashboard/movements",
      },
      {
        title: "scheduled",
        url: "#",
      },
      {
        title: "disputes",
        url: "#",
      },
    ],
  },
  {
    title: "bills",
    url: "#",
    icon: BadgeDollarSign,
  },
  {
    title: "benefits",
    url: "#",
    icon: UsersRound,
  },
  {
    title: "reports",
    url: "#",
    icon: ScrollText,
  },
  {
    title: "providers",
    url: "#",
    icon: PackagePlus,
  },
  {
    title: "payroll",
    url: "#",
    icon: HandCoins,
  },
  {
    title: "market_sheet",
    url: "#",
    icon: Store,
  },
  {
    title: "terminal",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "api",
    url: "#",
    icon: SquareTerminal,
  },
]
