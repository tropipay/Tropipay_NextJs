// table.d.ts
import React from "react"

interface ColumnDefinition {
  type:
    | "date"
    | "amount"
    | "facetedBadge"
    | "faceted"
    | "simpleText"
    | "free"
    | "select"
  field: string
  showFilter?: boolean
  enableHiding?: boolean
  hidden?: boolean
  size?: number
  order?: number
  optionList?: Array<{
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }> // Definir icon como un componente de React
  }>
  optionListGroups?: Record<string, string[]> // Agregar optionListGroups
  enableSorting?: boolean
  render?: (value: string) => string
  meta?: { [key: string]: any }
  title?: string // Agregar title
  format?: string // Agregar format para fechas
  component?: React.ReactElement // Agregar component para tipo "free"
  addSign?: boolean // Agregar addSign para tipo "amount"
}

interface ColumnResult {
  id: string
  accessorKey: string
  field: string
  enableSorting: boolean
  enableHiding: boolean
  hidden: boolean
  filter: boolean
  showFilter: boolean
  filterType: "date" | "amount" | "list" | "uniqueValue"
  filterLabel: string
  filterPlaceholder: string
  enableResizing: boolean
  size?: number
  order?: number
  optionList?: Array<{
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }> // Definir icon como un componente de React
  }>
  optionListGroups?: Record<string, string[]> // Agregar optionListGroups
  meta?: { [key: string]: any }
}

export interface Columns extends ColumnResult {
  type?:
    | "date"
    | "amount"
    | "facetedBadge"
    | "faceted"
    | "simpleText"
    | "free"
    | "select" // Tipos usados en el switch
  title?: string // Opcional, usado en header
  format?: string // Para fechas
  component?: React.ReactElement // Para tipo "free"
  addSign?: boolean // Para tipo "amount"
}
