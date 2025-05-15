"use client"

import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { CheckIcon, Eraser } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { FormattedMessage } from "react-intl"

// Componentes UI
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Separator } from "@/components/ui/Separator"

// Utilidades
import { cn, truncateLabels } from "@/utils/data/utils"
import { callPostHog } from "@/utils/utils"
import { usePostHog } from "posthog-js/react" // Importar usePostHog
import { useTranslation } from "../intl/useTranslation"

// Interfaces
interface DataTableFilterFacetedProps<TData, TValue> {
  tableId: string // Add tableId prop
  column?: Column<TData, TValue>
  onClear?: (filterId: string) => void
}

// Componente principal
export function DataTableFilterFaceted<TData, TValue>({
  tableId, // Receive tableId
  column,
  onClear,
}: DataTableFilterFacetedProps<TData, TValue>) {
  // Hooks
  const { t } = useTranslation()
  const postHog = usePostHog() 
  const searchParams = useSearchParams()
  // @ts-ignore
  const { filterLabel, optionList } = column?.config ?? {}

  // Estados y memoización
  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue() as string | undefined
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
    const filterValuesArray = Array.from(localSelectedValues)
    callPostHog(postHog, "filterFaceted_applied", {
      table_id: tableId,
      filter_id: column?.id,
      filter_type: "list",
      filter_value: filterValuesArray,
    })
    const serializedValue = filterValuesArray.join(",")
    column?.setFilterValue(
      filterValuesArray.length > 0 ? serializedValue : undefined
    )
  }

  const handleClearFilters = () => {
    if (!column) return
    const filterValuesArray = Array.from(localSelectedValues) // Get values before clearing
    if (filterValuesArray.length > 0) {
      callPostHog(postHog, "filterFaceted_clear", {
        table_id: tableId,
        filter_id: column.id,
        filter_value: filterValuesArray,
        filter_type: "list",
      })
      setLocalSelectedValues(new Set())
      column?.setFilterValue(undefined)

      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete(column?.id || "")
    } else onClear?.(column.id)
  }

  // Renderizado
  return (
    <Popover>
      <PopoverTrigger
        asChild
        data-test-id="dataTableFilterFaceted-popoverTrigger-openFilter"
      >
        <Button
          variant={selectedValues.size > 0 ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
        >
          <FormattedMessage id={filterLabel} />
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              <div className="space-x-1 lg:flex">
                {truncateLabels(
                  Array.from(selectedValues).map((value) => {
                    const option = optionList.find(
                      ({ label, value: optionValue }) =>
                        optionValue === value && !!label
                    )
                    return option ? t(option.label) : value
                  })
                )}
              </div>
            </>
          )}
          {/* Updated data-test-id for the clear filter icon container */}
          <div
            data-test-id="dataTableFilterFaceted-div-clearFilter"
            onClick={(e) => {
              e.stopPropagation()
              handleClearFilters()
            }}
          >
            {selectedValues.size > 0 ? (
              <Eraser className="h-4 w-4" />
            ) : (
              <CrossCircledIcon className="h-4 w-4" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[285px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t(filterLabel)}
            data-test-id="dataTableFilterFaceted-commandInput-search" // Added data-test-id
          />
          <CommandList className="px-2 pt-2">
            <CommandEmpty>
              <FormattedMessage id="no_filter_results" />
            </CommandEmpty>
            <CommandGroup className="px-3 pt-3 ">
              {optionList.map((option) => {
                const Icon = option.icon
                const isSelected = localSelectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectOption(option.value)}
                    data-test-id={`dataTableFilterFaceted-commandItem-toggleOption-${option.value}`}
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
                    <span>
                      {option.label ? (
                        <FormattedMessage id={option.label} />
                      ) : (
                        option.value
                      )}
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
        <div className="p-6">
          <PopoverClose asChild>
            <Button
              variant="default"
              className="w-full p-2"
              type="submit"
              onClick={handleApplyFilters}
              data-test-id="dataTableFilterFaceted-button-applyFilter" // Updated data-test-id
            >
              {<FormattedMessage id="apply" />}
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
