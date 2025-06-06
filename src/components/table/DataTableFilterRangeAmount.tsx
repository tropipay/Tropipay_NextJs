import InputAmount from "@/components/InputAmount"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Separator } from "@/components/ui/Separator"
import { formatAmount, selStyle } from "@/utils/data/utils"
import { callPostHog } from "@/utils/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { Eraser } from "lucide-react"
import { usePostHog } from "posthog-js/react" // Importar usePostHog
import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"

interface DataTableFilterRangeAmountProps<TData, TValue> {
  tableId: string
  column?: Column<TData, TValue>
  defaultOpenFilterOptions?: boolean
  onClear?: (filterId: string) => void
}

export function DataTableFilterRangeAmount<TData, TValue>({
  tableId, // Receive tableId
  column,
  onClear,
  defaultOpenFilterOptions = false,
}: DataTableFilterRangeAmountProps<TData, TValue>) {
  const { t } = useTranslation()
  const postHog = usePostHog()
  const filterValue = column?.getFilterValue() as string | undefined
  const [error, setError] = React.useState<string | null>(null)
  // @ts-ignore
  const { filterLabel } = column?.config || {}
  const [open, setOpen] = useState(defaultOpenFilterOptions)

  const handleApplyFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const min = formData.get("min") as string
    const max = formData.get("max") as string

    const minValue = min ? parseFloat(min) : undefined
    const maxValue = max ? parseFloat(max) : undefined

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      minValue > maxValue
    ) {
      setError("El valor mínimo no puede ser mayor que el valor máximo.")
      return
    }

    setError(null)
    callPostHog(postHog, "filter_range_amount:apply", {
      table_id: tableId,
      filter_id: column?.id,
      filter_type: "amount",
      filter_value: { min: minValue, max: maxValue },
    })
    const serializedValue = [minValue, maxValue].join(",")
    column?.setFilterValue(serializedValue)

    if (!error) {
      document.getElementById("close-popover")?.click()
    }
  }

  const handleClearFilter = () => {
    if (!column) return
    if (filterValue) {
      const [min, max] = filterValue
        .split(",")
        .map((v) => (v ? parseFloat(v) : undefined))
      callPostHog(postHog, "filter_range_amount:clear", {
        table_id: tableId,
        filter_id: column.id,
        filter_value: { min, max },
        filter_type: "amount",
      })
      column.setFilterValue(undefined)
      setError(null)
    } else onClear?.(column.id)
  }

  const renderFilterValue = () => {
    if (!filterValue) return null

    const [min, max] = filterValue.split(",").map((value) => {
      const parsedValue = parseFloat(value)
      return isNaN(parsedValue) ? undefined : parsedValue
    })

    return (
      <>
        {min !== undefined && max !== undefined
          ? `${formatAmount(min * 100, "EUR", "right")} - ${formatAmount(
              max * 100,
              "EUR",
              "right"
            )}`
          : null}
        {min !== undefined && max === undefined
          ? `Desde ${formatAmount(min * 100, "EUR", "right")}`
          : null}
        {min === undefined && max !== undefined
          ? `Hasta ${formatAmount(max * 100, "EUR", "right")}`
          : null}
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        data-test-id="dataTableFilterRangeAmount-popoverTrigger-openFilter"
      >
        <Button
          // @ts-ignore
          variant={selStyle(!!filterValue, "active", "inactive", "")}
          size="sm"
          className="px-2 h-8"
        >
          <FormattedMessage id={filterLabel} />
          {filterValue && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {renderFilterValue()}
            </>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleClearFilter()
            }}
          >
            {filterValue ? (
              <Eraser className="h-4 w-4" />
            ) : (
              <CrossCircledIcon className="h-4 w-4" />
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[264px] p-6" align="start">
        <form onSubmit={handleApplyFilter}>
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              <FormattedMessage id={filterLabel} />
            </Label>
          </div>
          <Label htmlFor="width">
            <FormattedMessage id="from" />
          </Label>
          <InputAmount
            name="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={t("minimum_opt")}
            value={
              !!filterValue
                ? (+filterValue.split(",")[0] * 100).toString() || ""
                : ""
            }
            data-test-id="dataTableFilterRangeAmount-input-amountMin" // Added data-test-id
          />
          <Label htmlFor="width">
            <FormattedMessage id="to" />
          </Label>
          <InputAmount
            name="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={t("maximum_opt")}
            value={
              !!filterValue
                ? (+filterValue.split(",")[1] * 100).toString() || ""
                : ""
            }
            data-test-id="dataTableFilterRangeAmount-input-amountMax" // Added data-test-id
          />
          <PopoverClose id="close-popover" className="hidden" />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {/* Added data-test-id to the apply filter button */}
          <Button
            variant="default"
            className="w-full mt-6"
            type="submit"
            data-test-id="dataTableFilterRangeAmount-button-applyFilter" // Updated data-test-id
          >
            <FormattedMessage id="apply" />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
