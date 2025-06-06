"use client"

import { DataTableFilterDate } from "./DataTableFilterDate"
import { DataTableFilterFaceted } from "./DataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./DataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./DataTableFilterSingleValue"

import { Table } from "@tanstack/react-table"

interface Props<TData, TValue> {
  column: any
  tableId: string
  table: Table<TData>
  defaultOpenFilterOptions?: boolean
  handleClearFilter: (filterId: string) => void
}

export function FilterTypeRenderer<TData, TValue>({
  column,
  tableId,
  table,
  defaultOpenFilterOptions = false,
  handleClearFilter,
}: Props<TData, TValue>) {
  switch (column.filterType) {
    case "list":
      return (
        <DataTableFilterFaceted
          key={column.id}
          tableId={tableId}
          column={{
            ...table.getColumn(column.id),
            //@ts-ignore
            config: column,
          }}
          defaultOpenFilterOptions={defaultOpenFilterOptions}
          onClear={handleClearFilter}
        />
      )
    case "date":
      return (
        <DataTableFilterDate
          key={column.id}
          tableId={tableId}
          column={{
            ...table.getColumn(column.id),
            //@ts-ignore
            config: column,
          }}
          defaultOpenFilterOptions={defaultOpenFilterOptions}
          onClear={handleClearFilter}
        />
      )
    case "amount":
      return (
        <DataTableFilterRangeAmount
          key={column.id}
          tableId={tableId}
          column={{
            ...table.getColumn(column.id),
            //@ts-ignore
            config: column,
          }}
          defaultOpenFilterOptions={defaultOpenFilterOptions}
          onClear={handleClearFilter}
        />
      )
    case "uniqueValue":
      return (
        <DataTableFilterSingleValue
          key={column.id}
          tableId={tableId}
          column={{
            ...table.getColumn(column.id),
            //@ts-ignore
            config: column,
          }}
          defaultOpenFilterOptions={defaultOpenFilterOptions}
          onClear={handleClearFilter}
        />
      )
    default:
      return null
  }
}
