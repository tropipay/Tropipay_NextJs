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
import clsx from "clsx"
import { format } from "date-fns"
import React from "react"
import { FormattedMessage } from "react-intl"

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
          {value.toLocaleString()} {currency}
        </div>
      )
    },
    filter: {
      type: "amount",
      column: "amount",
      label: <FormattedMessage id={"amount"} />,
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
        return null
      }
      const Icon = status.icon
      const states = {
        pendingIn: "statePending",
        processing: "stateProcessing",
        paid: "stateComplete",
        refunded: "stateRefund",
      }
      return (
        <Badge variant={states[row.getValue("status")]}>
          <span className="ml-1">{status.label}</span>
          <Icon className="ml-2 h-4 w-4 mr-1" />
        </Badge>
      )
    },
    filter: {
      type: "list",
      column: "status",
      label: <FormattedMessage id={"status"} />,
      options: movementsState,
    },
  },
  {
    id: "valueDate",
    accessorKey: "valueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"date"} />
    ),
    cell: ({ getValue }) => {
      const rawDate = getValue() as string
      try {
        const formattedDate = format(new Date(rawDate), "dd/MM/yyyy, HH:mm")
        return formattedDate
      } catch (error) {
        console.error("Error formateando la fecha:", error)
        return "Fecha inválida"
      }
    },
    filter: {
      type: "date",
      column: "valueDate",
      label: <FormattedMessage id={"date"} />,
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
        return null
      }
      return (
        <div>
          <span>{movementType.label}</span>
        </div>
      )
    },
    filter: {
      type: "list",
      column: "movementType",
      label: <FormattedMessage id={"type"} />,
      options: movementTypes,
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
        return null
      }
      const Icon = paymentMethod.icon
      return (
        <div
          className={clsx("flex items-center", {
            "text-red-500": paymentMethod.value === "transfer",
            "text-yellow-500": paymentMethod.value === "deposit",
            "text-green-500": paymentMethod.value === "payment",
            "text-gray-500": paymentMethod.value === "withdrawal",
          })}
        >
          {Icon && <Icon className="mr-2 h-5 w-5" />}
          <span>{paymentMethod.label}</span>
        </div>
      )
    },
    filter: {
      type: "list",
      column: "paymentMethod",
      label: <FormattedMessage id={"method"} />,
      options: paymentMethods,
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
    filter: {
      type: "uniqueValue",
      column: "sender",
      label: <FormattedMessage id={"user"} />,
      placeHolder: "user",
    },
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"reference"} />
    ),
    cell: ({ row }) => row.getValue("reference"),
    filter: {
      type: "uniqueValue",
      column: "reference",
      label: <FormattedMessage id={"reference"} />,
      placeHolder: "reference",
    },
  },
]
