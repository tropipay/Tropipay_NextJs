"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import clsx from "clsx"

import { DataTableColumnHeader } from "@/components/table/dataTableColumnHeader"
import {
  movementsState,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { format } from "date-fns"

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
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const { value, currency } = row.original.amount
      return `${value.toLocaleString()} ${currency}`
    },
    filter: {
      type: "amount",
      column: "amount",
      label: "Monto",
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = movementsState.find(
        (state) => state.value === row.getValue("status")
      )

      if (!status) {
        return null
      }
      const Icon = status.icon
      return (
        <div
          className={clsx("flex items-center", {
            "text-red-500": status.value === "pendingIn",
            "text-yellow-500": status.value === "processing",
            "text-green-500": status.value === "paid",
            "text-gray-500": status.value === "refund",
          })}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span>{status.label}</span>
        </div>
      )
    },
    filter: {
      type: "list",
      column: "status",
      label: "Estado",
      options: movementsState,
    },
  },
  {
    accessorKey: "valueDate",
    header: "Fecha",
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
      label: "Fecha",
    },
  },
  {
    accessorKey: "movementType",
    header: "Tipo",
    cell: ({ row }) => {
      const movementType = movementTypes.find(
        (movementType) => movementType.value === row.getValue("movementType")
      )

      if (!movementType) {
        return null
      }
      const Icon = movementType.icon
      return (
        <div
          className={clsx("flex items-center", {
            "text-red-500": movementType.value === "transfer",
            "text-yellow-500": movementType.value === "deposit",
            "text-green-500": movementType.value === "payment",
            "text-gray-500": movementType.value === "withdrawal",
          })}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span>{movementType.label}</span>
        </div>
      )
    },
    filter: {
      type: "list",
      column: "movementType",
      label: "Tipo",
      options: movementTypes,
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método",
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
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span>{paymentMethod.label}</span>
        </div>
      )
    },
    filter: {
      type: "list",
      column: "paymentMethod",
      label: "Método",
      options: paymentMethods,
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const sender = row.getValue("sender")

      // Si no hay remitente, muestra un valor predeterminado
      return sender || "Desconocido"
    },
    filter: {
      type: "uniqueValue",
      column: "user",
      label: "Usuario",
      placeHolder: "Nombre del Usuario",
    },
  },
  {
    accessorKey: "reference",
    header: "Identificador",
    cell: ({ row }) => {
      const identifier = row.getValue("reference")

      return identifier
    },
    filter: {
      type: "uniqueValue",
      column: "reference",
      label: "Identificador",
      placeHolder: "Identificador",
    },
  },
]
