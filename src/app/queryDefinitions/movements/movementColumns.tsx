"use client"

import {
  movementsState,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { DataTableColumnHeader } from "@/components/table/dataTableColumnHeader"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"

type FilterConfig<T> =
  | {
      type: "list"
      column: string
      label: React.ReactNode
      apiUrl?: string
      icon?: string
      options?: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
      }[]
    }
  | {
      type: "date"
      label: React.ReactNode
      column: string
    }
  | {
      type: "uniqueValue"
      column: string
      label: React.ReactNode
      placeHolder: string
    }
  | {
      type: "amount"
      column: string
      label?: React.ReactNode
    }

type MovementState = "Pendiente" | "Procesando" | "Completado" | "Reembolsado"

// Ajustamos CustomColumnDef para usar FilterConfig con T
export type CustomColumnDef<T> = ColumnDef<T> & {
  filter?: FilterConfig<T>
}

function capitalizeText(text: string) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
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
    cell: ({ row }) => {
      const { value, currency } = row.original.amount
      return (
        <div className="text-right">
          <span className="font-bold">{value.toLocaleString()}</span>{" "}
          <span className="text-grayFont">{currency}</span>
        </div>
      )
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"status"} />
    ),
    cell: ({ row }) => {
      const status = movementsState.find(
        (state) => state.value === row.getValue("status")
      )

      if (!status) {
        return row.getValue("status")
      }

      const stateGroups = {
        completedStates: ["charged", "paid"],
        processingStates: ["pendingIn", "processing", "onReview"],
        anotherStates: ["error"],
      }

      const getStateGroup = (state: string) => {
        for (const group in stateGroups) {
          if (stateGroups[group].includes(state)) {
            return group
          }
        }
        return null
      }

      const state = getStateGroup(row.getValue("status"))
      const Icon = status.icon

      return (
        <Badge variant={state}>
          <Icon className="ml-0 h-4 w-4 mr-2" />
          <span className="mr-0">{status.label}</span>
        </Badge>
      )
    },
  },
  {
    id: "valueDate",
    accessorKey: "valueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"date"} />
    ),
    cell: ({ getValue }) => {
      try {
        const isoDate = getValue() as string
        const formattedDate = format(new Date(isoDate), "dd/MM/yy HH:mm")
        return formattedDate
      } catch (error) {
        console.error("Error formateando la fecha:", error)
        return "Fecha inválida"
      }
    },
  },
  {
    id: "movementType",
    accessorKey: "movementType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"type"} />
    ),
    cell: ({ row }) => {
      const movementType = movementTypes.find(
        (movementType) => movementType.value === row.getValue("movementType")
      )

      if (!movementType) {
        return row.getValue("movementType")
      }
      return (
        <div>
          <span>
            {movementType.label} <b>OK</b>
          </span>
        </div>
      )
    },
  },
  {
    id: "paymentMethod",
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"method"} />
    ),
    cell: ({ row }) => {
      const paymentMethod = paymentMethods.find(
        (paymentMethod) => paymentMethod.value === row.getValue("paymentMethod")
      )
      if (!paymentMethod) {
        return row.getValue("paymentMethod")
      }
      const Icon = paymentMethod.icon
      return (
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-5 w-5" />}
          <span className="ml-1">
            {paymentMethod.label} <b>OK</b>
          </span>
        </div>
      )
    },
  },
  {
    id: "sender",
    accessorKey: "sender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"user"} />
    ),
    cell: ({ row }) => {
      const sender = row.getValue("sender")
      return sender || "Desconocido"
    },
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"reference"} />
    ),
    cell: ({ row }) => row.getValue("reference"),
  },
]
