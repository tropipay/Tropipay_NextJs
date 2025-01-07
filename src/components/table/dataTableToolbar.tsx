"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./dataTableViewOptions"

import { CustomColumnDef } from "@/app/queryDefinitions/movements/movementColumns"
import useFilterParams from "@/hooks/useFilterParams"
import { FormattedMessage, useIntl } from "react-intl"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  columns: CustomColumnDef<TData, TValue>[]
}

export function DataTableToolbar<TData, TValue>({
  table,
  columns,
}: DataTableToolbarProps<TData, TValue>) {
  const { formatMessage } = useIntl()
  const { setParam, getParam } = useFilterParams()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={formatMessage({ id: "filter" })}
            onChange={(event) => setParam("search", event.target.value)}
            className="w-full"
            defaultValue={getParam("query")?.toString()}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {columns.map((column) => {
            switch (column.filter?.type) {
              case "list":
                return (
                  <DataTableFilterFaceted
                    key={column.filter?.column}
                    column={table.getColumn(column.filter?.column)}
                    label={
                      column.filter?.label ||
                      table.getColumn(column.filter?.column)
                    }
                    options={column.filter?.options}
                    apiUrl={column.filter?.apiUrl}
                  />
                )
              case "date":
                return (
                  <DataTableFilterDate
                    key={column.filter?.column}
                    column={table.getColumn(column.filter?.column)}
                    label={column.filter?.label}
                  />
                )
              case "amount":
                return (
                  <DataTableFilterRangeAmount
                    key={column.filter?.column}
                    column={table.getColumn(column.filter?.column)}
                    label={column.filter?.label}
                  />
                )
              case "uniqueValue":
                return (
                  <DataTableFilterSingleValue
                    key={column.filter?.column}
                    column={table.getColumn(column.filter?.column)}
                    label={column.filter?.label}
                    placeHolder={column.filter?.placeHolder}
                  />
                )
            }
          })}

          {isFiltered && (
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              {<FormattedMessage id="clean_filters" />}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </>
  )
}
