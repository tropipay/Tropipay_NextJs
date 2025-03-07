import { SidebarOption } from "@/types/sidebarOption"
import { ArrowLeftRight, ScrollText, Banknote } from "lucide-react"

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
    url: "#",
    icon: Banknote,
  },
  {
    title: "reports",
    url: "#",
    icon: ScrollText,
  },
]
