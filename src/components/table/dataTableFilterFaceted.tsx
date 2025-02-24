"use client"

import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { CheckIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { FormattedMessage } from "react-intl"

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
import { Separator } from "@/components/ui/separator"

// Utilidades
import { cn, truncateLabels } from "@/lib/utils"
import { useTranslation } from "../intl/useTranslation"

// Interfaces
interface Option {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface ColumnConfig {
  filterLabel?: string
  optionList: Option[]
}

interface DataTableFilterFacetedProps<TData, TValue> {
  column?: Column<TData, TValue> & { config?: ColumnConfig }
}

export function DataTableFilterFaceted<TData, TValue>({
  column,
}: DataTableFilterFacetedProps<TData, TValue>) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  // Valores seleccionados desde el filtro de la columna
  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined
    return new Set(filterValue?.length ? filterValue[0].split(",") : [])
  }, [column])

  const [localSelectedValues, setLocalSelectedValues] =
    React.useState<Set<string>>(selectedValues)
  const facets = column?.getFacetedUniqueValues()

  // Configuración de la columna
  const { filterLabel = "filter", optionList = [] } = column?.config ?? {}

  // Sincronizar con searchParams al montar o cambiar
  React.useEffect(() => {
    const statusParam = searchParams.get(column?.id ?? "")
    const searchParamsValues = statusParam
      ? new Set(statusParam.split(","))
      : new Set<string>()
    setLocalSelectedValues(searchParamsValues)
  }, [searchParams, column?.id])

  // Funciones de manejo de filtros
  const handleSelectOption = React.useCallback((value: string) => {
    setLocalSelectedValues((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    })
  }, [])

  const handleApplyFilters = React.useCallback(() => {
    const filterValues = Array.from(localSelectedValues)
    const serializedValue = filterValues.join(",")
    column?.setFilterValue(
      filterValues.length > 0 ? serializedValue : undefined
    )
  }, [column, localSelectedValues])

  const handleClearFilters = React.useCallback(() => {
    setLocalSelectedValues(new Set())
    column?.setFilterValue(undefined)
  }, [column])

  // Renderizado de etiquetas seleccionadas
  const selectedLabels = React.useMemo(() => {
    return truncateLabels(
      Array.from(selectedValues).map((value) => {
        const option = optionList.find((opt) => opt.value === value)
        return option ? t(option.label) : value
      })
    )
  }, [selectedValues, optionList, t])

  if (!column) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selectedValues.size > 0 ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
          aria-label={t(filterLabel)}
        >
          <FormattedMessage id={filterLabel} />
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <div className="space-x-1 lg:flex">{selectedLabels}</div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearFilters()
                }}
                className="ml-2 cursor-pointer"
                aria-label="Clear filters"
              >
                <CrossCircledIcon className="h-4 w-4" />
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t(filterLabel)} />
          <CommandList>
            <CommandEmpty>No Filter results</CommandEmpty>
            <CommandGroup className="px-3 pt-3">
              {optionList.map((option) => {
                const Icon = option.icon
                const isSelected = localSelectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectOption(option.value)}
                    aria-selected={isSelected}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                      aria-checked={isSelected}
                      role="checkbox"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>
                      <FormattedMessage id={option.label} />
                    </span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-3 flex gap-2">
          <PopoverClose asChild>
            <Button
              variant="default"
              className="w-full"
              onClick={handleApplyFilters}
            >
              <FormattedMessage id="apply" />
            </Button>
          </PopoverClose>
          {/* Opcional: Botón Cancelar */}
          {/* <PopoverClose asChild>
            <Button variant="outline" className="w-full">
              <FormattedMessage id="cancel" />
            </Button>
          </PopoverClose> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}
