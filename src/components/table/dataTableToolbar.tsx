"use client"

import { CustomColumnDef } from "@/app/queryDefinitions/movements/movementColumns"
import { Input } from "@/components/ui/input"
import useFilterParams from "@/hooks/useFilterParams"
import { Table } from "@tanstack/react-table"
import { useTranslation } from "../intl/useTranslation"
import { DataTableFilterDate } from "./dataTableFilterDate"
import { DataTableFilterFaceted } from "./dataTableFilterFaceted"
import { DataTableFilterRangeAmount } from "./dataTableFilterRangeAmount"
import { DataTableFilterSingleValue } from "./dataTableFilterSingleValue"
import { DataTableViewOptions } from "./dataTableViewOptions"
import { Button } from "../ui/button"
import { Download, Ellipsis, Search, ArrowUpDown } from "lucide-react"

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  columns: CustomColumnDef<TData, TValue>[]
}

export function DataTableToolbar<TData, TValue>({
  table,
  columns,
}: DataTableToolbarProps<TData, TValue>) {
  const { t } = useTranslation()
  const { setParams, getParam } = useFilterParams()
  //const isFiltered = table.getState().columnFilters.length > 0

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Elementos alineados a la izquierda */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
            <Button variant="filterActive" className="px-2 h-8">
              Todos
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              Entrada
            </Button>
            <Button variant="filterInactive" className="px-2 h-8">
              Salida
            </Button>
          </div>
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 flex items-center text-gray-500">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <Input
              placeholder={t("Buscar")}
              onChange={(event) => setParams({ search: event.target.value })}
              className="pl-10 w-full" // Espacio para el ícono
              defaultValue={getParam("query")?.toString()}
            />
          </div>{" "}
        </div>

        {/* Elementos alineados a la derecha */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Fecha de creación
          </Button>
          <Button variant="outline">
            <Download />
          </Button>
          <Button variant="outline" className="m-0">
            <Ellipsis />
          </Button>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {columns.map((column) => {
            switch (column.filter?.type) {
              case "list":
                return (
                  <DataTableFilterFaceted key={column.id} column={column} />
                )
              case "date":
                return <DataTableFilterDate key={column.id} column={column} />
              case "amount":
                return (
                  <DataTableFilterRangeAmount key={column.id} column={column} />
                )
              case "uniqueValue":
                return (
                  <DataTableFilterSingleValue key={column.id} column={column} />
                )
            }
          })}

          {/*           {isFiltered && (
            <Button
              variant="outline"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              {<FormattedMessage id="clean_filters" />}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )} */}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </>
  )
}
