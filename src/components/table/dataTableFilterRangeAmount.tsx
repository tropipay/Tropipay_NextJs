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
import { useTranslation } from "../intl/useTranslation"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState, useEffect } from "react"
import InputAmount from "../inputAmount"

interface DataTableFilterRangeAmountProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableFilterRangeAmount<TData, TValue>({
  column,
}: DataTableFilterRangeAmountProps<TData, TValue>) {
  const { t } = useTranslation()
  const { label } = column.config.filter

  // Obtener el valor actual del filtro de la columna
  const filterValue = column?.getFilterValue() as
    | { min?: number; max?: number }
    | string
    | undefined

  // Parsear el valor del filtro si es una cadena
  const parsedFilterValue =
    typeof filterValue === "string"
      ? (JSON.parse(filterValue) as { min?: number; max?: number })
      : filterValue

  // Función para aplicar el filtro
  const handleApplyFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Obtener los valores directamente del formulario
    const formData = new FormData(e.currentTarget)
    const min = formData.get("min") as string
    const max = formData.get("max") as string

    const minValue = min ? parseFloat(min) : undefined
    const maxValue = max ? parseFloat(max) : undefined

    // Serializar el objeto a un formato válido para la URL
    const serializedValue = JSON.stringify({ min: minValue, max: maxValue })
    column?.setFilterValue(serializedValue)
  }

  // Función para limpiar el filtro
  const handleClearFilter = () => {
    column?.setFilterValue(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(
            parsedFilterValue?.min || parsedFilterValue?.max,
            "active",
            "inactive",
            ""
          )}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {parsedFilterValue?.min || parsedFilterValue?.max ? (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {parsedFilterValue?.min && parsedFilterValue?.max
                ? `${formatAmount(
                    parsedFilterValue.min * 100,
                    "EUR",
                    "right"
                  )} - ${formatAmount(
                    parsedFilterValue.max * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              {parsedFilterValue?.min && !parsedFilterValue?.max
                ? `Desde ${formatAmount(
                    parsedFilterValue.min * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              {!parsedFilterValue?.min && parsedFilterValue?.max
                ? `Hasta ${formatAmount(
                    parsedFilterValue.max * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              <div
                onClick={(event) => {
                  event.stopPropagation()
                  handleClearFilter()
                }}
              >
                <CrossCircledIcon className="h-4 w-4" />
              </div>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={handleApplyFilter}>
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              {label}
            </Label>
          </div>
          <Label htmlFor="width">
            <FormattedMessage id="from" />
          </Label>
          <InputAmount
            name="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} mín`}
            defaultValue={parsedFilterValue?.min?.toString() || ""}
          />
          <Label htmlFor="width">
            <FormattedMessage id="to" />
          </Label>
          <InputAmount
            name="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} máx`}
            defaultValue={parsedFilterValue?.max?.toString() || ""}
          />
          <PopoverClose asChild>
            <div className="py-2">
              <PopoverClose asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 text-white w-full"
                  type="submit"
                >
                  {<FormattedMessage id="apply" />}
                </Button>
              </PopoverClose>
            </div>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
