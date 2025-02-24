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
import { useState } from "react"
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

  const handleToggleColumn = (columnId: string) => {
    setPendingVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  const handleApply = () => {
    // 1. Aplicar cambios de visibilidad
    table.setColumnVisibility(pendingVisibility)

    // 2. Determinar columnas recién visibles
    const newlyVisible = table
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" &&
          column.getCanHide() &&
          pendingVisibility[column.id] &&
          !initialVisibility[column.id]
      )
      .map((c) => c.id)

    // 3. Actualizar orden solo si hay nuevas columnas visibles
    if (newlyVisible.length > 0) {
      const currentOrder = table.getState().columnOrder
      const cleanOrder = currentOrder.filter((id) => !newlyVisible.includes(id))
      table.setColumnOrder([...cleanOrder, ...newlyVisible])
    }
  }

  const sortedColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .sort((a, b) => a.id.localeCompare(b.id))

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (isOpen) {
          // Inicializar estados con visibilidad actual
          const visibilitySnapshot = Object.fromEntries(
            table.getAllColumns().map((c) => [c.id, c.getIsVisible()])
          )
          setInitialVisibility(visibilitySnapshot)
          setPendingVisibility(visibilitySnapshot)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline">
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
                const isVisible = pendingVisibility[column.id]
                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => handleToggleColumn(column.id)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isVisible
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{column.id}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2">
          <PopoverClose asChild>
            <Button variant="default" className="w-full" onClick={handleApply}>
              Aplicar
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
