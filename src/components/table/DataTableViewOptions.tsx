"use client"

import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/data/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { Table } from "@tanstack/react-table"
import { CheckIcon, Ellipsis } from "lucide-react"
import { useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { usePostHog } from "posthog-js/react"
import { useTranslation } from "../intl/useTranslation"
import { callPosthog } from "@/utils/utils" // Importar callPosthog
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  tableId: string // Añadir tableId a las props
}

export function DataTableViewOptions<TData>({
  table,
  tableId, // Recibir tableId
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation()
  const posthog = usePostHog() // Obtener instancia de PostHog
  const intl = useIntl()
  const [initialVisibility, setInitialVisibility] = useState<
    Record<string, boolean>
  >({})
  const [pendingVisibility, setPendingVisibility] = useState<
    Record<string, boolean>
  >({})

  // Translate and sort columns
  const sortedColumns = useMemo(() => {
    // Translate column names
    const translatedColumns = table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" &&
          // Only include columns that can be hidden
          column.getCanHide() &&
          // @ts-ignore
          !column.columnDef.hideColumn &&
          // @ts-ignore
          !column.columnDef.meta?.hidden
      )
      .map((column) => ({
        ...column,
        translatedHeader: intl.formatMessage({
          //@ts-ignore
          id: column?.columnDef?.filterLabel ?? column.id,
        }), // Translate the column name
      }))

    // Sort columns based on translated names
    return translatedColumns.sort((a, b) => {
      const isVisibleA = initialVisibility[a.id] ?? a.getIsVisible() ?? false
      const isVisibleB = initialVisibility[b.id] ?? b.getIsVisible() ?? false

      // Sort first by visibility (visible first)
      if (isVisibleA !== isVisibleB) {
        return isVisibleA ? -1 : 1
      }
      // If visibility is the same, sort alphabetically by the translated name
      return a.translatedHeader.localeCompare(b.translatedHeader)
    })
  }, [table, initialVisibility, intl])

  const handleToggleColumn = (columnId: string) => {
    setPendingVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  const handleApply = () => {
    const visibleColumns = Object.keys(pendingVisibility).filter(
      (id) => pendingVisibility[id]
    )
    const hiddenColumns = Object.keys(pendingVisibility).filter(
      (id) => !pendingVisibility[id]
    )

    callPosthog(posthog, "column_visibility_applied", {
      table_id: tableId,
      visible_columns: visibleColumns,
      hidden_columns: hiddenColumns,
    })

    table.setColumnVisibility(pendingVisibility)
    const newlyVisible = sortedColumns
      .filter(
        (column) =>
          pendingVisibility[column.id] && !initialVisibility[column.id]
      )
      .map((c) => c.id)

    if (newlyVisible.length > 0) {
      const currentOrder = table.getState().columnOrder
      const cleanOrder = currentOrder.filter((id) => !newlyVisible.includes(id))
      table.setColumnOrder([...cleanOrder, ...newlyVisible])
    }
  }
  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (isOpen) {
          const visibilitySnapshot = Object.fromEntries(
            table.getAllColumns().map((c) => [c.id, c.getIsVisible() ?? false])
          )
          setInitialVisibility(visibilitySnapshot)
          setPendingVisibility(visibilitySnapshot)
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="outline" aria-label="Column options">
              <Ellipsis className="mr-0 h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <FormattedMessage id="show_columns" />
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[270px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("search_columns")} />
          <CommandList>
            <CommandEmpty>
              <FormattedMessage id="no_results_found" />
            </CommandEmpty>
            <CommandGroup heading={t("columns")} className="px-3 pt-3 ">
              {sortedColumns.map((column) => {
                const isVisible =
                  pendingVisibility[column.id] ?? column.getIsVisible() ?? false
                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => handleToggleColumn(column.id)}
                    aria-selected={isVisible}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isVisible
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                      aria-checked={isVisible}
                      role="checkbox"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>{column.translatedHeader}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-3 flex gap-2">
          <PopoverClose asChild>
            {/* Added data-test-id to the apply button */}
            <Button
              variant="default"
              className="w-full"
              onClick={handleApply}
              data-test-id="dataTableViewOptions-button-apply" // Updated data-test-id
            >
              <FormattedMessage id="apply" />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
