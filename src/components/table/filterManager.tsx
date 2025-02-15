"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
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
interface FilterManagerProps<TData, TValue> {
  columns: Column<TData, TValue>[]
}

// Componente principal
export function FilterManager<TData, TValue>({
  columns,
}: FilterManagerProps<TData, TValue>) {
  // Hooks
  const searchParams = useSearchParams()

  // Obtener los filtros de las columnas
  const filters: FilterItem[] = columns.filter(
    (column) => !!column.filter && !!column.filterType
  )

  // Estado local para los filtros seleccionados
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set()
  )

  // Funciones
  const handleSelectOption = (columnId: string) => {
    const newSelectedFilters = new Set(selectedFilters)
    const filterKey = columnId

    if (newSelectedFilters.has(filterKey)) {
      newSelectedFilters.delete(filterKey)
    } else {
      newSelectedFilters.add(filterKey)
    }
    setSelectedFilters(newSelectedFilters)
  }

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Aplicar los filtros seleccionados a los parámetros de búsqueda
    filters.forEach((column) => {
      const filterValues = Array.from(selectedFilters)
        .filter((key) => key.startsWith(`${column.id}:`))
        .map((key) => key.split(":")[1])

      if (filterValues.length > 0) {
        newSearchParams.set(column.id, filterValues.join(","))
      } else {
        newSearchParams.delete(column.id)
      }
    })

    // Actualizar la URL con los nuevos parámetros de búsqueda
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  const handleClearFilters = () => {
    setSelectedFilters(new Set())
    const newSearchParams = new URLSearchParams(searchParams.toString())
    filters.forEach((column) => newSearchParams.delete(column.id))
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  // Renderizado
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="active" size="sm" className="px-2 h-8">
          ... filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar filtros..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados</CommandEmpty>
            <CommandGroup heading="Filtros">
              {columns.map((column) => {
                const isSelected = selectedFilters.has(column.id)
                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => handleSelectOption(column.id)}
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
                    <span>{column.filterLabel}</span>
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
              Aplicar
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
