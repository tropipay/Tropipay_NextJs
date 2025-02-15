"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { FormattedMessage } from "react-intl"
import { Column } from "@tanstack/react-table"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { CheckIcon } from "lucide-react"

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

// Interfaces
interface DataTableFilterFacetedProps<TData, TValue> {
  column?: Column<TData, TValue>
}

// Componente principal
export function DataTableFilterFaceted<TData, TValue>({
  column,
}: DataTableFilterFacetedProps<TData, TValue>) {
  // Hooks
  const searchParams = useSearchParams()
  const { filterLabel, optionList } = column?.config ?? {}

  // Estados y memoización
  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined
    return new Set(filterValue?.split(",") || [])
  }, [column?.getFilterValue()])

  const [localSelectedValues, setLocalSelectedValues] =
    React.useState<Set<string>>(selectedValues)

  const facets = column?.getFacetedUniqueValues()

  // Efectos
  React.useEffect(() => {
    const statusParam = searchParams.get(column?.id || "")
    const searchParamsValues = statusParam
      ? new Set(statusParam.split(","))
      : new Set<string>()
    setLocalSelectedValues(searchParamsValues)
  }, [searchParams, column?.id])

  // Funciones
  const handleSelectOption = (value: string) => {
    const newSelectedValues = new Set(localSelectedValues)
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value)
    } else {
      newSelectedValues.add(value)
    }
    setLocalSelectedValues(newSelectedValues)
  }

  const handleApplyFilters = () => {
    const filterValues = Array.from(localSelectedValues)
    const serializedValue = filterValues.join(",")
    column?.setFilterValue(
      filterValues.length > 0 ? serializedValue : undefined
    )
  }

  const handleClearFilters = () => {
    setLocalSelectedValues(new Set())
    column?.setFilterValue(undefined)

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete(column?.id || "")
  }

  // Renderizado
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selectedValues.size > 0 ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
        >
          {filterLabel}

          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              <div className="space-x-1 lg:flex">
                {truncateLabels(
                  Array.from(selectedValues).map(
                    (value) =>
                      optionList.find((option: any) => option.value === value)
                        ?.label || value
                  )
                )}
              </div>
            </>
          )}
          {selectedValues.size > 0 ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                handleClearFilters()
              }}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={filterLabel} />
          <CommandList>
            <CommandEmpty>{"No Filter results"}</CommandEmpty>
            <CommandGroup>
              {optionList.map((option) => {
                const Icon = option.icon
                const isSelected = localSelectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectOption(option.value)}
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
                    {Icon && <Icon className="ml-0 h-4 w-4" />}
                    <span>{option.label}</span>
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
        <div className="p-2">
          <PopoverClose asChild>
            <Button
              variant="default"
              className="bg-blue-600 text-white w-full"
              type="submit"
              onClick={handleApplyFilters}
            >
              {<FormattedMessage id="apply" />}
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
