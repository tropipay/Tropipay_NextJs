"use client"

import { Input } from "@/components/ui/input"
import CookiesManager from "@/lib/cookiesManager"
import { Table } from "@tanstack/react-table"
import { Download, Search } from "lucide-react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { Button } from "../ui/button"
import { DataTableViewOptions } from "./dataTableViewOptions"
import { FilterManager } from "./filterManager"

interface DataTableToolbarProps<TData, TValue> {
  tableId: string
  table: Table<TData>
  columns: any
}

export function DataTableToolbar<TData, TValue>({
  tableId,
  table,
  columns,
}: DataTableToolbarProps<TData, TValue>) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get("search") || ""
  const [searchValue, setSearchValue] = useState(searchParamValue)

  useEffect(() => {
    if (searchParamValue) {
      table.setColumnFilters((prev) => {
        const searchFilter = prev.find(({ id }) => id === "search")
        if (searchFilter) {
          return prev.map((filter) =>
            filter.id === "search"
              ? { ...filter, value: searchParamValue }
              : filter
          )
        }
        return [...prev, { id: "search", value: searchParamValue }]
      })
    }
  }, [searchParamValue, table])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    table.setColumnFilters((prev) => {
      const searchFilter = prev.find(({ id }) => id === "search")
      if (searchFilter) {
        return prev.map((filter) =>
          filter.id === "search" ? { ...filter, value } : filter
        )
      }
      return [...prev, { id: "search", value }]
    })
  }

  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") {
      setSearchValue("")
      table.resetColumnFilters()
    }
  }, [searchParams, table])

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Elementos alineados a la izquierda */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
            <Button variant="filterActive" className="px-2 h-8">
              <FormattedMessage id="all" />
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              <FormattedMessage id="entry" />
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              <FormattedMessage id="exit" />
            </Button>
          </div>
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 flex items-center text-gray-500">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <Input
              id="search"
              placeholder={t("search")}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Elementos alineados a la derecha */}
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download />
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      {/* Delegamos la visualización de filtros a FilterManager */}
      <FilterManager tableId={tableId} table={table} columns={columns} />
    </>
  )
}
