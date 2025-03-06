import { Checkbox } from "@/components/ui/checkbox"
import { formatAmount, setFilterType } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"
import { FormattedMessage } from "react-intl"
import { DataTableColumnHeader } from "./dataTableColumnHeader"
import FacetedBadge from "./facetedBadge"

// Definimos los tipos para los argumentos de la función
type FacetedOption = {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

type FacetedOptionGroup = {
  group: string
  options: FacetedOption[]
}

type ColumnOptions<TData> = {
  type:
    | "simpleText"
    | "faceted"
    | "date"
    | "facetedBadge"
    | "amount"
    | "free"
    | "select"
  title?: string
  optionList?: FacetedOption[]
  optionListGroups?: FacetedOptionGroup[]
  format?: string
  component?: React.ReactNode
  addSign?: boolean
  enableSorting?: boolean
  enableHiding?: boolean
  filter?: false | true | null
  filterType?: "list" | "date" | "amount" | "uniqueValue" | null
  filterLabel?: string
  filterPlaceholder?: string
  showFilter?: boolean
  hidden?: boolean
  size?: number
  enableResizing?: boolean
}

// Función unificada setColumns
export function setColumns<TData>(
  columnsConfig: Record<string, ColumnOptions<TData>>
): ColumnDef<TData>[] {
  return Object.entries(columnsConfig).map(([id, options]) => {
    const {
      type,
      title,
      optionList,
      optionListGroups,
      format: dateFormat,
      component,
      addSign = true,
      enableSorting = true,
      enableHiding = true,
      filter = true,
      filterType = setFilterType(filter, type),
      filterLabel = title || id,
      filterPlaceholder = title || id,
      showFilter = false,
      hidden = false,
      size,
      enableResizing = false,
    } = options

    let baseConfig: ColumnDef<TData> = {
      id: id,
      accessorKey: id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={title || id} />
      ),
      // @ts-ignore
      optionList,
      enableSorting: enableSorting,
      enableHiding: enableHiding,
      filterType,
      filterLabel,
      filterPlaceholder,
      filter,
      showFilter,
      hidden,
      size,
      enableResizing,
    }

    switch (type) {
      case "simpleText":
        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => (
            <div className="w-[200px]">
              <span className="truncate">{row.getValue(id)}</span>
            </div>
          ),
        }
        break
      case "faceted":
        if (!optionList) {
          throw new Error("optionList is required for faceted type")
        }

        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => {
            const selectedOption = optionList.find(
              (option) => option.value === row.getValue(id)
            )
            if (!selectedOption) {
              return row.getValue(id)
            }
            const Icon = selectedOption.icon
            return (
              <div className="flex items-center w-[168px]">
                {Icon && <Icon className="mr-2 h-5 w-5" />}
                <span className="ml-1 truncate">
                  <FormattedMessage id={selectedOption.label} />
                </span>
              </div>
            )
          },
        }
        break
      case "date":
        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => {
            try {
              const isoDate = row.getValue(id)
              const formattedDate = format(
                // @ts-ignore
                new Date(isoDate),
                dateFormat || "dd/MM/yy HH:mm"
              )
              return formattedDate
            } catch (error) {
              return "Fecha inválida"
            }
          },
        }
        break
      case "facetedBadge":
        if (!optionList || !optionListGroups) {
          throw new Error(
            "optionList and optionListGroups are required for facetedBadge type"
          )
        }

        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => (
            <FacetedBadge
              value={row.getValue(id)}
              optionList={optionList}
              optionListGroups={optionListGroups}
            />
          ),
        }
        break
      case "amount":
        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => {
            const { value, currency } = row.getValue(id) as any
            return (
              <div>
                <span className="font-bold">
                  {addSign && (value > 0 ? "+" : "")}
                  {formatAmount(value)}
                </span>{" "}
                <span className="text-grayFont">{currency}</span>
              </div>
            )
          },
        }
        break
      case "free":
        if (!component) {
          throw new Error("component is required for free type")
        }

        baseConfig = {
          ...baseConfig,
          cell: ({ row }) =>
            React.cloneElement(component as React.ReactElement, { row }),
        }
        break
      case "select":
        // @ts-ignore
        baseConfig = {
          ...baseConfig,
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value)
              }}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
          size: 50,
        }
        break
      default:
        baseConfig = {
          ...baseConfig,
          cell: ({ row }) => row.getValue(id),
        }
        break
    }

    return baseConfig
  })
}
