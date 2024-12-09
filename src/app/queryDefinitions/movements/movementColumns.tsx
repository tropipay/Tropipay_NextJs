"use client"

import { ColumnDef } from "@tanstack/react-table"
import clsx from "clsx"

import { DataTableColumnHeader } from "@/components/table/dataTableColumnHeader"
import { movementsState } from "@/app/filterDefinitions/definitions"

export const movementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Amount"} />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("amount")}</div>
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"State"} />
    ),
    cell: ({ row }) => {
      const state = movementsState.find(
        (state) => state.value === row.getValue("state")
      )

      if (!state) {
        return null
      }
      const Icon = state.icon
      return (
        <div
          className={clsx("flex items-center", {
            "text-red-500": state.value === "Pendiente",
            "text-yellow-500": state.value === "Procesando",
            "text-green-500": state.value === "Completado",
            "text-gray-500": state.value === "Reembolsado",
          })}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span>{state.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Date"} />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Type"} />
    ),
  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Method"} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"User"} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "bankOrderCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Bank Order Code"} />
    ),
  },
  {
    accessorKey: "concept",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Concept"} />
    ),
  },
]
