"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link" // Importa el componente Link de Next.js
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { SidebarOption } from "@/types/sidebarOption"
import React from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "./intl/useTranslation"

export function NavMain({ items }: { items: SidebarOption[] }) {
  const { t } = useTranslation()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <React.Fragment key={item.title}>
            {item.items ? (
              <Collapsible
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(item.title)}>
                      {item.icon && <item.icon />}
                      <FormattedMessage id={item.title} />
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            {/* Usa Link en lugar de <a> */}
                            <Link href={subItem.url}>
                              <FormattedMessage id={subItem.title} />
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t(item.title)}>
                  {item.icon && <item.icon />}
                  <FormattedMessage id={item.title} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
