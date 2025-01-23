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
    | undefined

  // Estado local para manejar los valores mínimos y máximos
  const [minValue, setMinValue] = useState<string>(
    filterValue?.min?.toString() || ""
  )
  const [maxValue, setMaxValue] = useState<string>(
    filterValue?.max?.toString() || ""
  )

  // Sincronizar el estado local con el valor del filtro cuando cambie
  useEffect(() => {
    setMinValue(filterValue?.min?.toString() || "")
    setMaxValue(filterValue?.max?.toString() || "")
  }, [filterValue])

  // Función para actualizar los valores del estado local
  const handleFilterChange = (id: string, value: string) => {
    if (id === "min") {
      setMinValue(value)
    } else if (id === "max") {
      setMaxValue(value)
    }
  }

  // Función para aplicar el filtro
  const handleApplyFilter = () => {
    const min = minValue ? parseFloat(minValue) : undefined
    const max = maxValue ? parseFloat(maxValue) : undefined

    // Serializar el objeto a un formato válido para la URL
    const serializedValue = JSON.stringify({ min, max })
    column?.setFilterValue(serializedValue)
  }

  // Función para limpiar el filtro
  const handleClearFilter = () => {
    setMinValue("")
    setMaxValue("")
    column?.setFilterValue(undefined)
  }

  // Deserializar el valor del filtro si es necesario
  useEffect(() => {
    if (typeof filterValue === "string") {
      try {
        const parsedValue = JSON.parse(filterValue)
        setMinValue(parsedValue.min?.toString() || "")
        setMaxValue(parsedValue.max?.toString() || "")
      } catch (error) {
        console.error("Error parsing filter value:", error)
      }
    }
  }, [filterValue])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(
            filterValue?.min || filterValue?.max,
            "active",
            "inactive",
            ""
          )}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {filterValue?.min || filterValue?.max ? (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {filterValue?.min && filterValue?.max
                ? `${formatAmount(
                    filterValue.min * 100,
                    "EUR",
                    "right"
                  )} - ${formatAmount(filterValue.max * 100, "EUR", "right")}`
                : null}
              {filterValue?.min && !filterValue?.max
                ? `Desde ${formatAmount(filterValue.min * 100, "EUR", "right")}`
                : null}
              {!filterValue?.min && filterValue?.max
                ? `Hasta ${formatAmount(filterValue.max * 100, "EUR", "right")}`
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleApplyFilter()
          }}
        >
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              {label}
            </Label>
          </div>
          <Label htmlFor="width">
            <FormattedMessage id="from" />
          </Label>
          <Input
            id="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} mín`}
            value={minValue}
            onChange={(e) => handleFilterChange("min", e.target.value)}
          />
          <Label htmlFor="width">
            <FormattedMessage id="to" />
          </Label>
          <Input
            id="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} máx`}
            value={maxValue}
            onChange={(e) => handleFilterChange("max", e.target.value)}
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
