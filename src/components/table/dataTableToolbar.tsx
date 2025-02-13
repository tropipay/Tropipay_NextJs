"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { useTranslation } from "../intl/useTranslation"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"
import { DataTableViewOptions } from "./dataTableViewOptions"
import { Button } from "../ui/button"
import { Download, Ellipsis, Search, ArrowUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" // Importa useSearchParams

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  columns: any
  filters: any
}

export function DataTableToolbar<TData, TValue>({
  table,
  columns,
  filters,
}: DataTableToolbarProps<TData, TValue>) {
  const { t } = useTranslation()
  const searchParams = useSearchParams() // Obtén los searchParams de la URL
  const searchParamValue = searchParams.get("search") || "" // Obtén el valor del parámetro "search"
  const [searchValue, setSearchValue] = useState(searchParamValue) // Inicializa el estado con el valor de searchParams

  // Efecto para sincronizar el valor del input con el filtro de la tabla al montar el componente
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
  }, []) // Solo se ejecuta al montar el componente

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)

    // Actualizar el filtro de búsqueda en la tabla
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

  // Verificar si hay filtros aplicados
  const isFiltered = table.getState().columnFilters.length > 0

  // Efecto para detectar cuando la URL quede sin searchParams
  useEffect(() => {
    if (!searchParams || searchParams.toString() === "") {
      setSearchValue("") // Limpia el input de búsqueda
      table.resetColumnFilters() // Reinicia los filtros de la tabla
    }
  }, [searchParams]) // Dependencia: searchParams

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
              placeholder={t("filter")}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Elementos alineados a la derecha */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Fecha de creación
          </Button>
          <Button variant="outline">
            <Download />
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {filters.map((filter) => {
            const column = {
              ...columns.filter((col) => col.column === filter.column),
              filter: filter,
            }
            switch (filter.type) {
              case "list":
                return (
                  <DataTableFilterFaceted
                    key={filter.column}
                    column={{
                      ...table.getColumn(filter.column),
                      config: column,
                    }}
                  />
                )
              case "date":
                return (
                  <DataTableFilterDate
                    key={filter.column}
                    column={{
                      ...table.getColumn(filter.column),
                      config: column,
                    }}
                  />
                )
              case "amount":
                return (
                  <DataTableFilterRangeAmount
                    key={filter.column}
                    column={{
                      ...table.getColumn(filter.column),
                      config: column,
                    }}
                  />
                )
              case "uniqueValue":
                return (
                  <DataTableFilterSingleValue
                    key={filter.column}
                    column={{
                      ...table.getColumn(filter.column),
                      config: column,
                    }}
                  />
                )
            }
          })}
        </div>

        <Button
          disabled={!isFiltered}
          variant={isFiltered ? "active" : "inactive"}
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2"
        >
          {t("clean_filters")}
        </Button>
      </div>
    </>
  )
}
