"use client"

import { PopoverClose } from "@radix-ui/react-popover"
import { Column, Table } from "@tanstack/react-table"
import { CheckIcon, Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"

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

// Utilidades
import { cn } from "@/lib/utils"
import { FormattedMessage } from "react-intl"

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

  // Estado para almacenar los filtros ordenados
  const [sortedFilters, setSortedFilters] = React.useState<
    Column<TData, TValue>[]
  >([])

  const sortingFilters = () => {
    const sorted = filters
      .slice() // Copia del array para no mutar el original
      .sort((a, b) => {
        // Primero ordenar por estado de selección
        const aSelected = selectedFilters.has(a.id)
        const bSelected = selectedFilters.has(b.id)

        if (aSelected && !bSelected) return -1
        if (!aSelected && bSelected) return 1

        // Si ambos están seleccionados o no seleccionados, ordenar alfabéticamente
        return a.filterLabel.localeCompare(b.filterLabel)
      })

    setSortedFilters(sorted)
  }
  // Ordenar los filtros solo al cargar el listado
  React.useEffect(() => {
    sortingFilters()
  }, [])

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
          onClick={sortingFilters}
        >
          <Plus />
          <span>
            <FormattedMessage id="filters" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar filtros..." />
          <CommandList>
            <CommandEmpty>
              <FormattedMessage id="no_results_found" />
            </CommandEmpty>
            <CommandGroup heading="">
              {sortedFilters.map((column) => {
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
                    <span>
                      <FormattedMessage id={column.filterLabel} />
                    </span>
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
              <FormattedMessage id="apply" />
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
