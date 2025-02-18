import { ColumnDef } from "@tanstack/react-table" // Asegúrate de importar el tipo correcto
import { DataTableColumnHeader } from "./dataTableColumnHeader" // Ruta ajustada
import FacetedBadge from "./facetedBadge" // Ruta ajustada
import { format } from "date-fns" // Importamos date-fns para formatear fechas
import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { formatAmount } from "@/lib/utils"

// Definimos los tipos para los argumentos de la función
type FacetedOption = {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }> // Ícono opcional
}

type FacetedOptionGroup = {
  group: string
  options: FacetedOption[]
}

type ColumnOptions<TData> = {
  type:
    | "simpleText"
    | "faceted"
    | "date"
    | "facetedBadge"
    | "amount"
    | "free"
    | "select" // Tipos de columnas
  title?: string // Título opcional para el header
  optionList?: FacetedOption[] // Lista de opciones para los tipos "faceted" y "facetedBadge"
  optionListGroups?: FacetedOptionGroup[] // Grupos de opciones para el tipo "facetedBadge"
  format?: string // Formato de fecha para el tipo "date"
  component?: React.ReactNode // Componente personalizado para el tipo "free"
  addSign?: boolean // Agregar signo (+) al monto (valor por defecto: true)
  enableSorting?: boolean // Habilitar ordenamiento (valor por defecto: true)
  enableHiding?: boolean // Habilitar ocultamiento (valor por defecto: true)
  filter?: false | true | null // Tipo de filtro
  filterType?: "list" | "date" | "amount" | "uniqueValue" | null // Tipo de filtro
  filterLabel?: string // Etiqueta del filtro (valor por defecto: title o id)
  filterPlaceholder?: string // Placeholder del filtro (valor por defecto: title o id)
  showFilter?: boolean // Mostrar el filtro (valor por defecto: false)
  hidden?: boolean // Ocultar la columna (valor por defecto: true)
}

const setFilterType = (filter: any, type: any): string | null => {
  const filterTypeResult = {
    simpleText: "uniqueValue",
    faceted: "list",
    date: "date",
    amount: "amount",
    facetedBadge: "list",
    free: "uniqueValue",
    select: null,
  }
  return filterTypeResult[type]
}

// Función setColumn con TypeScript
export function setColumn<TData>(
  id: string,
  options: ColumnOptions<TData>
): ColumnDef<TData> {
  const {
    type,
    title,
    optionList,
    optionListGroups,
    format: dateFormat,
    component,
    addSign = true,
    enableSorting = true,
    enableHiding = true,
    filter = true,
    filterType = setFilterType(filter, type),
    filterLabel = title || id,
    filterPlaceholder = title || id,
    showFilter = false,
    hidden = false,
  } = options

  const baseConfig: ColumnDef<TData> = {
    id: id,
    accessorKey: id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title || id} /> // Usamos title o id como fallback
    ),
    optionList,
    enableSorting: enableSorting,
    enableHiding: enableHiding,
    filterType,
    filterLabel,
    filterPlaceholder,
    filter,
    showFilter,
    hidden,
  }

  // Lógica para el contenido de la celda según el tipo
  switch (type) {
    case "simpleText":
      baseConfig.cell = ({ row }) => <div>{row.getValue(id)}</div>
      break
    case "faceted":
      if (!optionList) {
        throw new Error("optionList is required for faceted type")
      }
      baseConfig.cell = ({ row }) => {
        const selectedOption = optionList.find(
          (option) => option.value === row.getValue(id)
        )
        if (!selectedOption) {
          return row.getValue(id) // Si no se encuentra la opción, devolver el valor crudo
        }
        const Icon = selectedOption.icon
        return (
          <div className="flex items-center">
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            <span className="ml-1">
              {selectedOption.label} <b>OK</b>
            </span>
          </div>
        )
      }
      break
    case "date":
      baseConfig.cell = ({ row }) => {
        try {
          const isoDate = row.getValue(id)
          const formattedDate = format(
            new Date(isoDate),
            dateFormat || "dd/MM/yy HH:mm"
          )
          return formattedDate
        } catch (error) {
          console.error("Error formateando la fecha:", error)
          return "Fecha inválida"
        }
      }
      break
    case "facetedBadge":
      if (!optionList || !optionListGroups) {
        throw new Error(
          "optionList and optionListGroups are required for facetedBadge type"
        )
      }
      baseConfig.cell = ({ row }) => (
        <FacetedBadge
          value={row.getValue(id)}
          optionList={optionList}
          optionListGroups={optionListGroups}
        />
      )
      break
    case "amount":
      baseConfig.cell = ({ row }) => {
        const { value, currency } = row.getValue(id)
        return (
          <div className="text-right">
            <span className="font-bold">
              {addSign && (value > 0 ? "+" : "")}
              {formatAmount(value)}
            </span>{" "}
            <span className="text-grayFont">{currency}</span>
          </div>
        )
      }
      break
    case "free":
      if (!component) {
        throw new Error("component is required for free type")
      }
      baseConfig.cell = ({ row }) => {
        // Clonamos el componente y le pasamos la fila como prop
        return React.cloneElement(component as React.ReactElement, { row })
      }
      break
    case "select":
      baseConfig.header = ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
        />
      )
      baseConfig.cell = ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label="Select row"
        />
      )
      baseConfig.enableSorting = false
      baseConfig.enableHiding = false
      break
    default:
      baseConfig.cell = ({ row }) => row.getValue(id)
      break
  }

  return baseConfig
}
