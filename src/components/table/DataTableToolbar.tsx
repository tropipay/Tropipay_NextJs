"use client"

import FilterCategories from "@/components/table/FilterCategories"
import { Input } from "@/components/ui/Input"
import { callPosthog } from "@/utils/utils" // Importar callPosthog
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useTranslation } from "../intl/useTranslation"
import { DataTableViewOptions } from "./DataTableViewOptions"
import { FilterManager } from "./FilterManager"

interface Props<TData, TValue> {
  tableId: string
  table: Table<TData>
  columns: any
  categoryFilterId: string
  categoryFilters?: string[]
  actions?: React.ReactNode
}

export function DataTableToolbar<TData, TValue>({
  tableId,
  table,
  columns,
  categoryFilterId,
  categoryFilters,
  actions,
}: Props<TData, TValue>) {
  const { t } = useTranslation()
  const posthog = usePostHog() // Obtener instancia de PostHog
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get("search") || ""
  const searchColumn = table.getColumn("search")
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

  const handleSearchChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      callPosthog(posthog, "filterSearch_applied", {
        table_id: tableId,
      })

      if (value) {
        table.setColumnFilters((prev) => {
          const searchFilter = prev.find(({ id }) => id === "search")
          if (searchFilter) {
            return prev.map((filter) =>
              filter.id === "search" ? { ...filter, value } : filter
            )
          }
          return [...prev, { id: "search", value }]
        })
      } else {
        searchColumn?.setFilterValue(undefined)
      }
    },
    500
  )

  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") {
      table.resetColumnFilters()
    }
  }, [searchParams, table])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterCategories {...{ table, categoryFilterId, categoryFilters }} />
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 flex items-center text-gray-500">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <Input
              id="search"
              type="search"
              placeholder={t("search")}
              onChange={handleSearchChange}
              className="pl-10 w-full"
              defaultValue={searchParamValue}
              data-test-id="dataTableToolbar-input-search" // Updated data-test-id
            />
          </div>
        </div>

        {/* Elementos alineados a la derecha */}
        <div className="flex items-center gap-2">
          {actions}
          <DataTableViewOptions table={table} tableId={tableId} />
        </div>
      </div>
      {/* Delegamos la visualización de filtros a FilterManager */}
      <FilterManager tableId={tableId} table={table} columns={columns} />
    </>
  )
}
