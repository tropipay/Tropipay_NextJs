"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { Table } from "@tanstack/react-table"
import { CheckIcon, Ellipsis } from "lucide-react"
import { useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation()
  const [initialVisibility, setInitialVisibility] = useState<
    Record<string, boolean>
  >({})
  const [pendingVisibility, setPendingVisibility] = useState<
    Record<string, boolean>
  >({})

  // Ordenar columnas usando initialVisibility para mantener el orden estático
  const sortedColumns = useMemo(() => {
    return table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" && column.getCanHide()
      )
      .sort((a, b) => {
        const isVisibleA = initialVisibility[a.id] ?? a.getIsVisible() ?? false
        const isVisibleB = initialVisibility[b.id] ?? b.getIsVisible() ?? false

        // Ordenar primero por visibilidad (visibles primero)
        if (isVisibleA !== isVisibleB) {
          return isVisibleA ? -1 : 1
        }
        // Si la visibilidad es igual, ordenar alfabéticamente por id
        return a.id.localeCompare(b.id)
      })
  }, [table, initialVisibility])

  const handleToggleColumn = (columnId: string) => {
    setPendingVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  const handleApply = () => {
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
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label="Opciones de columnas">
          <Ellipsis className="mr-0 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
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
                    <span>
                      <FormattedMessage id={column.id} />
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-3 flex gap-2">
          <PopoverClose asChild>
            <Button variant="default" className="w-full" onClick={handleApply}>
              <FormattedMessage id="apply" />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
