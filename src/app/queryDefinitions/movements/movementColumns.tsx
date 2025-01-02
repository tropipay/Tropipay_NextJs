"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import clsx from "clsx"

import { DataTableColumnHeader } from "@/components/table/dataTableColumnHeader"
import {
  usersStatus,
  movementsState,
  methodList,
} from "@/app/filterDefinitions/definitions"

type FilterConfig<T> =
  | {
      type: "list"
      column: string
      label: string
      apiUrl: string
      icon?: string
      options?: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
      }[]
    }
  | {
      type: "date"
      label: string
      column: string
    }
  | {
      type: "uniqueValue"
      column: string
      label: string
      placeHolder: string
    }
  | {
      type: "amount"
      column: string
      label?: string
    }

// Ajustamos CustomColumnDef para usar FilterConfig con T
export type CustomColumnDef<T> = ColumnDef<T> & {
  filter?: FilterConfig<T>
}

export const movementColumns: CustomColumnDef<Movement>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"amount"} />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("amount")}</div>
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("amount")}</div>
    },
    filter: {
      type: "amount",
      column: "amount",
      label: "Monto",
    },
  },
  {
    id: "state",
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"state"} />
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
    /*     filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
 */ filter: {
      type: "list",
      column: "state",
      label: "Estado",
      options: usersStatus,
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"date"} />
    ),
    filter: {
      type: "date",
      column: "date",
      label: "Fecha",
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"type"} />
    ),
  },
  {
    id: "method",
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"method"} />
    ),
    filter: {
      type: "list",
      column: "method",
      label: "Método",
      options: methodList,
    },
  },
  {
    id: "user",
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"user"} />
    ),
    filter: {
      type: "uniqueValue",
      column: "user",
      label: "Usuario",
      placeHolder: "Nombre del Usuario",
    },
  },
  {
    id: "bankOrderCode",
    accessorKey: "bankOrderCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"bank_order_code"} />
    ),
  },
  {
    id: "concept",
    accessorKey: "concept",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"concept"} />
    ),
  },
]
