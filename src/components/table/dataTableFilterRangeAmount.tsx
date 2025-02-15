import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { formatAmount, selStyle } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { FormattedMessage } from "react-intl"
import { Label } from "../ui/label"
import InputAmount from "../inputAmount"
import React from "react"

interface DataTableFilterRangeAmountProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableFilterRangeAmount<TData, TValue>({
  column,
}: DataTableFilterRangeAmountProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as string | undefined

  const [error, setError] = React.useState<string | null>(null)

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
    const serializedValue = [minValue, maxValue].join(",")
    column?.setFilterValue(serializedValue)
  }

  const handleClearFilter = () => {
    column?.setFilterValue(undefined)
    setError(null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(filterValue, "active", "inactive", "")}
          size="sm"
          className="px-2 h-8"
        >
          {column?.config?.filter?.label || "Filtrar por monto"}
          {filterValue && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {(() => {
                const [min, max] = filterValue.split(",").map((value) => {
                  const parsedValue = parseFloat(value)
                  return isNaN(parsedValue) ? undefined : parsedValue
                })

                return (
                  <>
                    {min !== undefined && max !== undefined
                      ? `${formatAmount(
                          min * 100,
                          "EUR",
                          "right"
                        )} - ${formatAmount(max * 100, "EUR", "right")}`
                      : null}
                    {min !== undefined && max === undefined
                      ? `Desde ${formatAmount(min * 100, "EUR", "right")}`
                      : null}
                    {min === undefined && max !== undefined
                      ? `Hasta ${formatAmount(max * 100, "EUR", "right")}`
                      : null}
                  </>
                )
              })()}
              <div
                onClick={(event) => {
                  event.stopPropagation()
                  handleClearFilter()
                }}
              >
                <CrossCircledIcon className="h-4 w-4" />
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form
          onSubmit={(e) => {
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
              setError(
                "El valor mínimo no puede ser mayor que el valor máximo."
              )
              return
            }

            setError(null)
            const serializedValue = [minValue, maxValue].join(",")
            column?.setFilterValue(serializedValue)

            // Cerrar el Popover solo si no hay errores
            if (!error) {
              document.getElementById("close-popover")?.click()
            }
          }}
        >
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              {column?.config?.filter?.label || "Filtrar por monto"}
            </Label>
          </div>
          <Label htmlFor="width">
            <FormattedMessage id="from" />
          </Label>
          <InputAmount
            name="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Mínimo"
            value={filterValue ? filterValue.split(",")[0] * 100 || "" : ""}
          />
          <Label htmlFor="width">
            <FormattedMessage id="to" />
          </Label>
          <InputAmount
            name="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Máximo"
            value={filterValue ? filterValue.split(",")[1] * 100 || "" : ""}
          />
          <PopoverClose id="close-popover" />
          <PopoverClose id="close-popover" className="hidden" />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="py-2">
            <Button
              variant="default"
              className="bg-blue-600 text-white w-full"
              type="submit"
            >
              <FormattedMessage id="apply" />
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
