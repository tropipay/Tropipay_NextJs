"use client"

import FilterCategories from "@/components/table/FilterCategories"
import { callPostHog } from "@/utils/utils"
import { Table } from "@tanstack/react-table"
import { useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useTranslation } from "../intl/useTranslation"
import { DataTableSearchInput } from "./DataTableSearchInput"
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
  const postHog = usePostHog()
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

      callPostHog(postHog, "filter_search:apply", {
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
    800
  )

  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") {
      table.resetColumnFilters()
    }
  }, [searchParams, table])

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FilterCategories {...{ table, categoryFilterId, categoryFilters }} />
          <DataTableSearchInput
            handleSearchChange={handleSearchChange}
            searchParamValue={searchParamValue}
          />
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
