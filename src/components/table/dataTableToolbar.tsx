"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { ArrowUpDown, Download, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "../intl/useTranslation"
import { Button } from "../ui/button"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"
import { DataTableViewOptions } from "./dataTableViewOptions"
import { FilterManager } from "./filterManager"
import { DateFilter } from "@/app/dashboard/movements/dateFilter"

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  columns: any
}

export function DataTableToolbar<TData, TValue>({
  table,
  columns,
}: DataTableToolbarProps<TData, TValue>) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get("search") || ""
  const [searchValue, setSearchValue] = useState(searchParamValue)
  const [activeFilters, setActiveFilters] = useState(
    columns.filter((column) => column.showFilter)
  )

  useEffect(() => {
    if (searchParamValue) {
      table.setColumnFilters((prev) => {
        const searchFilter = prev.find((filter) => filter.id === "search")
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
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    table.setColumnFilters((prev) => {
      const searchFilter = prev.find((filter) => filter.id === "search")
      if (searchFilter) {
        return prev.map((filter) =>
          filter.id === "search" ? { ...filter, value } : filter
        )
      }
      return [...prev, { id: "search", value }]
    })
  }

  const isFiltered = table.getState().columnFilters.length > 0

  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") {
      setSearchValue("") // Limpia el input de búsqueda
      table.resetColumnFilters() // Reinicia los filtros de la tabla
    }
  }, [searchParams])

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Elementos alineados a la izquierda */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
            <Button variant="filterActive" className="px-2 h-8">
              Todos
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              Entrada
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              Salida
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
          <DateFilter table={table} />
          <Button variant="outline">
            <Download />
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2 py-2 overflow-x-auto">
          <FilterManager
            table={table}
            columns={columns}
            setActiveFilters={setActiveFilters}
          />
          {activeFilters.map((column) => {
            switch (column.filterType) {
              case "list":
                return (
                  <DataTableFilterFaceted
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      config: column,
                    }}
                  />
                )
              case "date":
                return (
                  <DataTableFilterDate
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      config: column,
                    }}
                  />
                )
              case "amount":
                return (
                  <DataTableFilterRangeAmount
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      config: column,
                    }}
                  />
                )
              case "uniqueValue":
                return (
                  <DataTableFilterSingleValue
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      config: column,
                    }}
                  />
                )
            }
          })}
          {isFiltered && (
            <Button
              disabled={!isFiltered}
              variant="primary"
              onClick={() => {
                table.resetColumnFilters()
              }}
              className="h-8 px-2"
            >
              {t("clean_filters")}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
