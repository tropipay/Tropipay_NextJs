"use client"

import { usePathname } from "next/navigation"
import React from "react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { SidebarOption } from "@/types/SidebarOption"
import { sideBarOptions } from "@/app/data/sideBarOptions"

const getBreadcrumbItems = (
  path: string,
  options: SidebarOption[]
): SidebarOption[] => {
  const breadcrumbItems: SidebarOption[] = []

  const findPath = (options: SidebarOption[], path: string): boolean => {
    for (const option of options) {
      if (option.url === path) {
        breadcrumbItems.push(option)
        return true
      }
      if (option.items && findPath(option.items, path)) {
        breadcrumbItems.unshift(option)
        return true
      }
    }
    return false
  }

  findPath(options, path)
  return breadcrumbItems
}

const DynamicBreadcrumb: React.FC = () => {
  const pathname = usePathname() // Obtiene la ruta actual
  const breadcrumbItems = getBreadcrumbItems(pathname, sideBarOptions)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <BreadcrumbItem className={index > 0 ? "hidden md:block" : ""}>
              {item.url ? (
                <BreadcrumbLink
                  href={item.url}
                  className="font-poppins font-semibold text-2xl text-foreground uppercase"
                >
                  {item.title.toUpperCase()}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-poppins font-semibold text-2xl text-foreground uppercase">
                  {item.title.toUpperCase()}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DynamicBreadcrumb
