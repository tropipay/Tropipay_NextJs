"use client"

import CookiesManager from "@/lib/cookiesManager"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column, Table } from "@tanstack/react-table"
import { CheckIcon, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import * as React from "react"

// Componentes UI
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { FormattedMessage, useIntl } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"

interface FilterManagerProps<TData, TValue> {
  tableId: string
  table: Table<TData>
  columns: Column<TData, TValue>[]
}

export function FilterManager<TData, TValue>({
  tableId,
  table,
  columns,
}: FilterManagerProps<TData, TValue>) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { t } = useTranslation()
  const intl = useIntl()
  const searchParams = useSearchParams()

  // Filtros disponibles
  const filters = columns
    .filter(
      ({ filter, filterType, meta }: any) => !!filter && !!filterType && !meta
    )
    .map((filter: any) => ({
      ...filter,
      translatedLabel: intl.formatMessage({ id: filter.filterLabel }),
    }))

  // Obtener filtros aplicados desde searchParams
  const appliedFiltersFromSearchParams = React.useMemo(() => {
    const appliedIds = new Set<string>()
    filters.forEach((filter: any) => {
      if (searchParams.has(filter.id)) {
        appliedIds.add(filter.id)
      }
    })
    return appliedIds
  }, [searchParams, filters])

  // Estado para filtros seleccionados
  const initialSelectedFilters = userId
    ? CookiesManager.getInstance().get(`userFilters-${tableId}-${userId}`, "")
    : ""
  const defaultSelectedFilters = initialSelectedFilters
    ? initialSelectedFilters
    : columns.filter(({ showFilter }: any) => showFilter).map(({ id }) => id)
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set([...defaultSelectedFilters, ...appliedFiltersFromSearchParams])
  )

  // Estado para filtros activos
  const [activeFilters, setActiveFilters] = React.useState<
    Column<TData, TValue>[]
  >(
    columns.filter(
      ({ id }: any) =>
        selectedFilters.has(id) || appliedFiltersFromSearchParams.has(id)
    )
  )

  // Ordenación de filtros
  const [sortedFilters, setSortedFilters] = React.useState<
    Column<TData, TValue>[]
  >([])
  const sortingFilters = () => {
    const sorted = filters.slice().sort((a: any, b: any) => {
      const aSelected = selectedFilters.has(a.id)
      const bSelected = selectedFilters.has(b.id)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return a.translatedLabel.localeCompare(b.translatedLabel)
    })
    setSortedFilters(sorted)
  }

  // Persistencia en cookies
  React.useEffect(() => {
    if (userId) {
      CookiesManager.getInstance().set(
        `userFilters-${tableId}-${userId}`,
        Array.from(selectedFilters)
      )
    }
  }, [userId, selectedFilters, tableId])

  // Selección de filtros
  const handleSelectOption = (columnId: string) => {
    const newSelectedFilters = new Set(selectedFilters)
    if (newSelectedFilters.has(columnId)) {
      newSelectedFilters.delete(columnId)
    } else {
      newSelectedFilters.add(columnId)
    }
    setSelectedFilters(newSelectedFilters)
  }

  // Aplicar filtros seleccionados
  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    filters.forEach((column) => {
      if (!selectedFilters.has(column.id)) {
        newSearchParams.delete(column.id)
      }
    })
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)

    const newFilters = columns.filter(({ id }) => selectedFilters.has(id))
    setActiveFilters(newFilters)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    const appliedFilters = table.getState().columnFilters
    const remainingFilters = appliedFilters.filter(
      ({ id }) => !filters.some((filter) => filter.id === id)
    )
    table.setColumnFilters(remainingFilters)
  }

  /**
   * Clear filter by id.
   * @param filterId Filter identifier.
   */
  const handleClearFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(({ id }) => id !== filterId))
    const newSelectedFilters = new Set(selectedFilters)
    if (newSelectedFilters.has(filterId)) {
      newSelectedFilters.delete(filterId)
      setSelectedFilters(newSelectedFilters)
    }
  }

  // Verificar si hay filtros aplicados , excluyendo los que tienen meta.hidden

  const isFiltered = React.useMemo(() => {
    const appliedFilters = table.getState().columnFilters
    return appliedFilters.some(({ id }) => {
      const column = filters.find((col) => col.id === id)
      return column && !column.columnDef?.meta?.hidden
    })
  }, [table.getState().columnFilters, columns])

  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-1 items-start space-x-2 p-0 overflow-x-auto mr-4 pr-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="px-2 h-8 bg-grayBackground"
              onClick={sortingFilters}
            >
              <Plus />
              <span>
                <FormattedMessage id="filters" />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[264px] p-0" align="start">
            <Command>
              <CommandInput placeholder={t("search_filters")} />
              <CommandList>
                <CommandEmpty>
                  <FormattedMessage id="no_results_found" />
                </CommandEmpty>
                <CommandGroup heading="" className="px-3 pt-3 ">
                  {sortedFilters.map(({ id, translatedLabel }: any) => {
                    const isSelected = selectedFilters.has(id)
                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => handleSelectOption(id)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                        <span>{translatedLabel}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="p-3">
              <PopoverClose asChild>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleApplyFilters}
                >
                  <FormattedMessage id="apply" />
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>

        {/* Renderizado de filtros activos */}
        {activeFilters
          .sort((a, b) => {
            const isAFiltered = table
              .getState()
              .columnFilters.some(({ id }) => id === a.id)
            const isBFiltered = table
              .getState()
              .columnFilters.some(({ id }) => id === b.id)

            if (isAFiltered && !isBFiltered) return -1
            if (!isAFiltered && isBFiltered) return 1

            const aLabel = intl.formatMessage({ id: a.id })
            const bLabel = intl.formatMessage({ id: b.id })
            return aLabel.localeCompare(bLabel)
          })
          .map((column: any) => {
            switch (column.filterType) {
              case "list":
                return (
                  <DataTableFilterFaceted
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      // @ts-ignore
                      config: column,
                    }}
                    onClear={handleClearFilter}
                  />
                )
              case "date":
                return (
                  <DataTableFilterDate
                    key={column.id}
                    // @ts-ignore
                    column={{
                      ...table.getColumn(column.id),
                      config: column,
                    }}
                    onClear={handleClearFilter}
                  />
                )
              case "amount":
                return (
                  <DataTableFilterRangeAmount
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      // @ts-ignore
                      config: column,
                    }}
                    onClear={handleClearFilter}
                  />
                )
              case "uniqueValue":
                return (
                  <DataTableFilterSingleValue
                    key={column.id}
                    column={{
                      ...table.getColumn(column.id),
                      // @ts-ignore
                      config: column,
                    }}
                    onClear={handleClearFilter}
                  />
                )
            }
          })}
      </div>

      {/* Botón de limpieza de filtros */}
      {isFiltered && (
        <Button
          variant="active"
          onClick={handleClearFilters}
          className="h-8 px-2"
        >
          <FormattedMessage id="clean_filters" />
        </Button>
      )}
    </div>
  )
}
