"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  movementsState,
  usersStatus,
} from "@/app/queryDefinitions/users/definitions"
import { DataTableFacetedFilter } from "./dataTableFacetedFilter"
import { DataTableViewOptions } from "./dataTableViewOptions"

import { useSearchParams, usePathname, useRouter } from "next/navigation"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const isFiltered = table.getState().columnFilters.length > 0
  function filterInput(query: string) {
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("search", query)
    } else {
      params.delete("search")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={"Filter"}
            onChange={(event) => filterInput(event.target.value)}
            className="w-full"
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {table.getColumn("state") && (
            <>
              <DataTableFacetedFilter
                column={table.getColumn("state")}
                title={"State"}
                options={movementsState}
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
