import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Table } from "@tanstack/react-table"
import { ArrowUpDown, ChevronUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useState } from "react" // Importar useState para controlar el estado del Popover

interface DateFilterProps<TData, TValue> {
  table: Table<TData>
}

export function DateFilter<TData, TValue>({
  table,
}: DateFilterProps<TData, TValue>) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false) // Estado para controlar el Popover
  const valueDate = table.getColumn("valueDate")
  const creationDate = table.getColumn("creationDate")

  // Determinar el ícono basado en el orden actual
  const Icon =
    valueDate?.getIsSorted() === "asc" || creationDate?.getIsSorted() === "asc"
      ? ChevronUp
      : ArrowUpDown

  // Función para manejar el ordenamiento y cerrar el Popover
  const handleSort = (
    column: typeof valueDate | typeof creationDate,
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
            onClick={() => handleSort(creationDate, false)}
          >
            <span>Fecha de creación</span>
          </button>
          {/* Opción para ordenar por fecha valor */}
          <button
            className="mb-2 flex w-full text-left"
            onClick={() => handleSort(valueDate, false)}
          >
            <span>Fecha valor</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
