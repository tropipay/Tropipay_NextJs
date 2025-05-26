import { SidebarOption } from "@/types/sidebarOption"
import { ArrowLeftRight, Banknote } from "lucide-react"

export const sideBarOptions: SidebarOption[] = [
  {
    title: "movements",
    url: "#",
    icon: ArrowLeftRight,
    isActive: true,
    items: [
      {
        title: "all",
        url: "/dashboard/movements",
      },
      {
        title: "scheduled",
        url: "/dashboard/movements/scheduled",
      },
      // {
      //   title: "disputes",
      //   url: "#",
      // },
    ],
  },
  {
    title: "charges",
    url: "/dashboard/charges",
    icon: Banknote,
    isActive: true,
    // items: [
    //   {
    //     title: "all",
    //     url: "/dashboard/charges",
    //   },
    // ],
  },
  // {
  //   title: "reports",
  //   url: "",
  //   icon: ScrollText,
  //   items: [
  //     {
  //       title: "balance_summary",
  //       url: "/dashboard/reports",
  //     },
  //   ],
  // },
]
