import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader"
import FacetedBadge from "@/components/table/FacetedBadge"
import { Checkbox } from "@/components/ui/Checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { formatAmount, getRowValue, setFilterType } from "@/utils/data/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"
import { FormattedMessage } from "react-intl"
import { TextToCopy } from "../TextToCopy"

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
  filterSearchType?: "EXACT_MATCH" | "PARTIAL_MATCH" | "CONTAINS"
  filterLabel?: string
  filterPlaceholder?: string
  showFilter?: boolean
  hidden?: boolean
  field?: string
  size?: number
  enableResizing?: boolean
  order?: number
  meta?: boolean
  hideColumn?: boolean
  render?: (row: any) => string
  toClipboard?: boolean
}

export function renderedAmount(
  value: number,
  currency: string,
  addSign: boolean,
  toClipboard: boolean
) {
  const formattedValue = `${addSign && value > 0 ? "+" : ""}$${formatAmount(
    value
  )} ${currency}`

  return toClipboard ? (
    <TextToCopy
      value={
        <div className="flex items-center gap-1">
          <span className="font-bold">
            {addSign && (value > 0 ? "+" : "")}
            {formatAmount(value)}
          </span>
          <span className="text-grayFont">{currency}</span>
        </div>
      }
      textToCopy={formattedValue}
    />
  ) : (
    <div className="flex items-center gap-1">
      <span className="font-bold">
        {addSign && (value > 0 ? "+" : "")}
        {formatAmount(value)}
      </span>
      <span className="text-grayFont">{currency}</span>
    </div>
  )
}

// Función unificada setColumns
export function setColumns<TData>(
  columnsConfig: Record<string, ColumnOptions<TData>>
): ColumnDef<TData>[] {
  return Object.entries(columnsConfig).map(([id, options], index) => {
    const {
      type = "simpleText",
      field = id,
      title,
      optionList,
      optionListGroups,
      format: dateFormat,
      component,
      addSign = true,
      enableSorting = false,
      enableHiding = true,
      filter = true,
      filterType = setFilterType(type),
      filterLabel = title || id,
      filterPlaceholder = title || id,
      filterSearchType = "CONTAINS",
      showFilter = false,
      hidden = false,
      size,
      enableResizing = false,
      order = Object.keys(columnsConfig).length + index,
      meta,
      hideColumn = false,
      render,
      toClipboard = true,
    } = options

    let baseConfig: ColumnDef<TData> = {
      id,
      accessorKey: id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={title || id} />
      ),
      // @ts-expect-error
      optionList,
      enableSorting,
      enableHiding,
      filterType,
      filterLabel,
      filterPlaceholder,
      filterSearchType,
      filter,
      showFilter,
      hidden,
      field,
      size,
      enableResizing,
      order,
      meta,
      hideColumn,
      toClipboard,
    }

    switch (type) {
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
              <div className="flex items-center">
                {Icon && (
                  <div className="w-[19px] mr-2">
                    <Icon className="h-5" />
                  </div>
                )}
                <span className="ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {toClipboard ? (
                    <TextToCopy
                      value={<FormattedMessage id={selectedOption.label} />}
                      textToCopy={selectedOption.label}
                      className="pl-0"
                      translate={true}
                    />
                  ) : (
                    <FormattedMessage id={selectedOption.label} />
                  )}
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
              let value = "-"
              if (row.getValue(id)) {
                const isoDate = row.getValue(id)
                value = format(
                  // @ts-ignore
                  new Date(isoDate),
                  dateFormat || "dd/MM/yy HH:mm"
                )
              }
              if (toClipboard && value !== "-") {
                return <TextToCopy value={value.toString()} />
              }
              return value
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
            const rowValue = row.original[id]
            const { value, currency } = rowValue || {}
            return renderedAmount(value, currency, addSign, toClipboard)
          },
        }
        break
      case "select":
        // @ts-expect-error
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
          cell: ({ row }) => {
            if (render) return render(row.original)
            const value = getRowValue(row.getValue(id))
            if (value === "-") return value

            const TextWithTooltip = ({ text }: { text: string }) => {
              const [isTruncated, setIsTruncated] = React.useState(false)
              const textRef = React.useRef<HTMLDivElement>(null)

              React.useEffect(() => {
                if (textRef.current) {
                  setIsTruncated(
                    textRef.current.scrollWidth > textRef.current.clientWidth
                  )
                }
              }, [text])

              return isTruncated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div ref={textRef} className="truncate">
                      {text}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    {text}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div ref={textRef} className="truncate">
                  {text}
                </div>
              )
            }

            return toClipboard ? (
              <TextToCopy
                value={<TextWithTooltip text={value} />}
                textToCopy={row.original[id]}
              />
            ) : (
              <TextWithTooltip text={value} />
            )
          },
        }
    }

    return baseConfig
  })
}
