"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui"
import { SidebarOption } from "@/types/sidebarOption"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "./intl/useTranslation"

export function NavMain({ items }: { items: SidebarOption[] }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
  const onItemClick = (url: string) => router.push(url)

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
                    <div>
                      <SidebarMenuButton
                        tooltip={t(item.title)}
                        className="group-data-[collapsible=icon]:hidden"
                      >
                        {item.icon && <item.icon />}
                        <FormattedMessage id={item.title} />
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>

                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div
                              className={sidebarMenuButtonVariants({
                                variant: "default",
                                size: "default",
                              })}
                            >
                              {item.icon && <item.icon />}
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                            align={"start"}
                          >
                            <DropdownMenuGroup>
                              {item.items?.map((subItem) => (
                                <DropdownMenuItem key={`ms-${subItem.title}`}>
                                  <a href={subItem.url}>
                                    <FormattedMessage id={subItem.title} />
                                  </a>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={`s-${subItem.title}`}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              {<FormattedMessage id={subItem.title} />}
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
                  tooltip={t(item.title)}
                  {...(item.url && { onClick: () => onItemClick(item.url) })}
                >
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
