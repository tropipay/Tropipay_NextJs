"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Ellipsis, CheckIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { PopoverClose } from "@radix-ui/react-popover"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
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
  }, [table, initialVisibility]) // Dependencia en initialVisibility en lugar de pendingVisibility

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
          <CommandInput placeholder="Buscar columnas..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados</CommandEmpty>
            <CommandGroup heading="Columnas">
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
                    <span>{column.id}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2 flex gap-2">
          <PopoverClose asChild>
            <Button variant="default" className="w-full" onClick={handleApply}>
              Aplicar
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
