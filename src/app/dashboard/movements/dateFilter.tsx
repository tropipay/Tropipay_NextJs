import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui"
import { Table } from "@tanstack/react-table"
import { ArrowUpDown, ChevronUp } from "lucide-react"
import { useState } from "react" // Importar useState para controlar el estado del Popover

interface DateFilterProps<TData, TValue> {
  table: Table<TData>
}

export function DateFilter<TData, TValue>({
  table,
}: DateFilterProps<TData, TValue>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false) // Estado para controlar el Popover
  const completedAt = table.getColumn("completedAt")
  const createdAt = table.getColumn("createdAt")

  // Determinar el ícono basado en el orden actual
  const Icon =
    completedAt?.getIsSorted() === "asc" || createdAt?.getIsSorted() === "asc"
      ? ChevronUp
      : ArrowUpDown

  // Función para manejar el ordenamiento y cerrar el Popover
  const handleSort = (
    column: typeof completedAt | typeof createdAt,
    ascending: boolean
  ) => {
    column?.toggleSorting(ascending)
    setIsPopoverOpen(false) // Cerrar el Popover después de seleccionar
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          Fecha de creación
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-3" align="start">
        <Label
          htmlFor="filterValue"
          className="text-xs font-semibold text-grayFont ml-2"
        >
          Ordenar por
        </Label>
        <div className="ml-2 text-sm">
          {/* Opción para ordenar por fecha de creación */}
          <button
            className="mb-2 mt-2 flex w-full text-left"
            onClick={() => handleSort(createdAt, false)}
          >
            <span>Fecha de creación</span>
          </button>
          {/* Opción para ordenar por fecha valor */}
          <button
            className="mb-2 flex w-full text-left"
            onClick={() => handleSort(completedAt, false)}
          >
            <span>Fecha valor</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
