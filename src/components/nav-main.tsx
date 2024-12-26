"use client"

import { ChevronRight } from "lucide-react"

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
import { SidebarOption } from "@/types/SidebarOption"
import React from "react"
import { FormattedMessage } from "react-intl"

export function NavMain({ items }: { items: SidebarOption[] }) {
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
                    <SidebarMenuButton
                      tooltip={<FormattedMessage id={item.title} />}
                    >
                      {item.icon && <item.icon />}
                      <span>
                        <FormattedMessage id={item.title} />
                      </span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>
                                {<FormattedMessage id={subItem.title} />}
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={<FormattedMessage id={item.title} />}
                >
                  {item.icon && <item.icon />}
                  <span>{<FormattedMessage id={item.title} />}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
