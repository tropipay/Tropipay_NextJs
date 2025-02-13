"use client"

import {
  movementsState,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { DataTableColumnHeader } from "@/components/table/dataTableColumnHeader"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatAmount } from "@/lib/utils"
import { format } from "date-fns"
import React from "react"

// Ajustamos CustomColumnDef para usar FilterConfig con T

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
          <span className="font-bold">
            {value > 0 ? "+" : ""}
            {formatAmount(value, "")}
          </span>{" "}
          <span className="text-grayFont">{currency}</span>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: "state",
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"state"} />
    ),
    cell: ({ row }) => {
      const state = movementsState.find(
        (thisState) => thisState.value === row.getValue("state")
      )

      if (!state) {
        return row.getValue("state")
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

      const stateVariant = getStateGroup(row.getValue("state"))
      const Icon = state.icon

      return (
        <Badge variant={stateVariant}>
          <Icon className="ml-0 h-4 w-4 mr-2" />
          <span className="mr-0">{state.label}</span>
        </Badge>
      )
    },
    enableHiding: false,
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
    enableHiding: false,
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
    enableSorting: false,
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
