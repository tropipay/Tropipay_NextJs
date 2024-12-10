"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./dataTableViewOptions"

import {
  methodList,
  movementsState,
  userList,
} from "@/app/filterDefinitions/definitions"
import useFilterParams from "@/hooks/useFilterParams"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { setParam, getParam } = useFilterParams()
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={"Filter"}
            onChange={(event) => setParam("search", event.target.value)}
            className="w-full"
            defaultValue={getParam("query")?.toString()}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {table.getColumn("state") && (
            <>
              <DataTableFilterFaceted
                key={"state"}
                column={table.getColumn("state")}
                title={"State"}
                options={movementsState}
              />
              <DataTableFilterDate
                key={"method"}
                column={table.getColumn("method")}
                title={"Method"}
                options={methodList}
              />
              <DataTableFilterSingleValue
                column={table.getColumn("Card BIN")}
                title={"Card BIN"}
                options={userList.sort((a, b) =>
                  a.label.localeCompare(b.label)
                )}
              />
              <DataTableFilterRangeAmount
                column={table.getColumn("Amount")}
                title={"Amount"}
                options={userList.sort((a, b) =>
                  a.label.localeCompare(b.label)
                )}
              />
            </>
          )}

          {isFiltered && (
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              {"Clean Filters"}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </>
  )
}
