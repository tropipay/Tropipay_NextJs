"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Separator } from "@/components/ui/Separator"
import { selStyle } from "@/utils/data/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { Eraser } from "lucide-react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { usePostHog } from "posthog-js/react" // Importar usePostHog
import { callPosthog } from "@/utils/utils" // Importar callPosthog
import { useTranslation } from "../intl/useTranslation"

interface DataTableFilterSingleValueProps<TData, TValue> {
  tableId: string // Add tableId prop
  column?: Column<TData, TValue>
  onClear?: (filterId: string) => void
}

export function DataTableFilterSingleValue<TData, TValue>({
  tableId, // Receive tableId
  column,
  onClear,
}: DataTableFilterSingleValueProps<TData, TValue>) {
  const { t } = useTranslation()
  const posthog = usePostHog() // Get posthog instance
  // @ts-ignore
  const { filterLabel, filterPlaceholder } = column?.config ?? {}

  // Estado interno para manejar el valor del filtro localmente
  const [localFilterValue, setLocalFilterValue] = useState<string | undefined>(
    column?.getFilterValue() as string | undefined
  )

  // Función para actualizar el valor del filtro localmente
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilterValue(event.target.value)
  }

  // Función para aplicar el filtro a la columna
  const handleApplyFilter = (event: React.FormEvent) => {
    event.preventDefault()
    callPosthog(posthog, "filter_value_applied", {
      table_id: tableId,
      filter_id: column?.id,
      filter_type: "uniqueValue",
      filter_value: localFilterValue || undefined,
    })
    column?.setFilterValue(localFilterValue || undefined)
  }

  // Función para limpiar el filtro
  const handleClearFilter = () => {
    if (!column) return
    if (localFilterValue) {
      callPosthog(posthog, "filter_value_cleared_from_badge", {
        table_id: tableId,
        filter_id: column.id,
        filter_value: localFilterValue, // Value before clearing
        filter_type: "uniqueValue",
      })
      setLocalFilterValue(undefined)
      column.setFilterValue(undefined)
    } else onClear?.(column.id)
  }

  const filterValue = column?.getFilterValue() as string | undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          // @ts-ignore
          variant={selStyle(filterValue, "active", "inactive", "")}
          size="sm"
          className="px-2 h-8"
        >
          <FormattedMessage id={filterLabel} />
          {filterValue && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {filterValue}
            </>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation()
              handleClearFilter()
            }}
          >
            {filterValue ? (
              <Eraser className="h-4 w-4" />
            ) : (
              <CrossCircledIcon className="h-4 w-4" />
            )}
          </div>
        </Button>
      </PopoverTrigger>

      {/* Updated data-test-id for the clear filter icon container */}
      <div
        data-test-id="dataTableFilterSingleValue-div-clearFilter"
        onClick={(e) => {
          e.stopPropagation()
          handleClearFilter()
        }}
      >
        {filterValue ? (
          <Eraser className="h-4 w-4" />
        ) : (
          <CrossCircledIcon className="h-4 w-4" />
        )}
      </div>

      <PopoverContent className="w-[264px] p-6" align="start">
        <form onSubmit={handleApplyFilter}>
          <Label htmlFor="filterValue" className="my-2 font-bold text-gray-800">
            <FormattedMessage id={filterLabel} />
          </Label>
          <div className="mt-3">
            <span className="text-xs text-gray-600 font-medium">
              <FormattedMessage
                id={
                  // @ts-ignore
                  `st_${column?.config.filterSearchType}`
                }
              />
            </span>
          </div>

          <Input
            id="filterValue"
            className="mt-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={filterPlaceholder ? t(filterPlaceholder) : ""}
            value={localFilterValue || ""}
            onChange={handleFilterChange}
            data-test-id="dataTableFilterSingleValue-input-filterValue" // Added data-test-id
          />
          <PopoverClose asChild>
            {/* Added data-test-id to the apply filter button */}
            <Button
              variant="default"
              className="w-full mt-6"
              type="submit"
              data-test-id="dataTableFilterSingleValue-button-applyFilter" // Updated data-test-id
            >
              <FormattedMessage id="apply" />
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
