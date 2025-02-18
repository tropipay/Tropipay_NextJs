"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Column, Table } from "@tanstack/react-table"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { CheckIcon, Plus } from "lucide-react"

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
  table: Table<TData>
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
}

// Componente principal
export function FilterManager<TData, TValue>({
  columns,
  table,
  setActiveFilters,
}: FilterManagerProps<TData, TValue>) {
  // Hooks
  const searchParams = useSearchParams()

  // Obtener los filtros de las columnas
  const filters = columns.filter(
    (column) => !!column.filter && !!column.filterType
  )

  // Estado local para los filtros seleccionados
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set(
      filters.filter((column) => column.showFilter).map((column) => column.id)
    )
  )

  // Funciones
  const handleSelectOption = (columnId: string) => {
    const newSelectedFilters = new Set(selectedFilters)

    if (newSelectedFilters.has(columnId)) {
      newSelectedFilters.delete(columnId)
    } else {
      newSelectedFilters.add(columnId)
    }
    setSelectedFilters(newSelectedFilters)
  }

  const handleApplyFilters = () => {
    // Crear un nuevo objeto URLSearchParams con los parámetros actuales
    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Recorrer todos los filtros disponibles
    filters.forEach((column) => {
      if (!selectedFilters.has(column.id)) {
        // Si el filtro no está seleccionado, eliminarlo de la URL
        newSearchParams.delete(column.id)
      }
    })

    // Actualizar la URL con los parámetros limpios
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)

    // Actualizar los filtros activos
    const newFilters = []
    selectedFilters.forEach((columnId) => {
      const column = columns.find((col) => col.id === columnId)
      if (column) {
        newFilters.push(column)
      }
    })
    setActiveFilters(newFilters)
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
        <Button
          variant="primary"
          size="sm"
          className="px-2 h-8 bg-grayBackground"
        >
          <Plus />
          <span>filtros</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar filtros..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados</CommandEmpty>
            <CommandGroup heading="">
              {filters.map((column) => {
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
              className="w-full"
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
