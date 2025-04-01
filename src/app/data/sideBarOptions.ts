import { SidebarOption } from "@/types/sidebarOption"
import { ArrowLeftRight, Banknote, ScrollText } from "lucide-react"

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
    title: "payments",
    url: "",
    icon: Banknote,
    isActive: true,
    items: [
      {
        title: "all",
        url: "/dashboard/payments",
      },
    ],
  },
  {
    title: "reports",
    url: "",
    icon: ScrollText,
    items: [
      {
        title: "balance_summary",
        url: "/dashboard/reports",
      },
    ],
  },
]
