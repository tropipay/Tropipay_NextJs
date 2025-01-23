import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { selStyle } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"

interface DataTableFilterSingleValueProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableFilterSingleValue<TData, TValue>({
  column,
}: DataTableFilterSingleValueProps<TData, TValue>) {
  const { t } = useTranslation()
  const { label, placeHolder } = column.config.filter ?? {}

  // Estado interno para manejar el valor del filtro localmente
  const [localFilterValue, setLocalFilterValue] = useState<string | undefined>(
    column?.getFilterValue() as string | undefined
  )

  // Función para actualizar el valor del filtro localmente
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilterValue(event.target.value)
  }

  // Función para aplicar el filtro a la columna
  const handleApplyFilter = (event: React.FormEvent) => {
    event.preventDefault()
    column?.setFilterValue(localFilterValue || undefined)
  }

  // Función para limpiar el filtro
  const handleClearFilter = () => {
    setLocalFilterValue(undefined)
    column?.setFilterValue(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(column?.getFilterValue(), "active", "inactive", "")}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {!!column?.getFilterValue() && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {column?.getFilterValue() as string}
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
        <form onSubmit={handleApplyFilter}>
          <Label htmlFor="filterValue" className="my-2">
            {label}
          </Label>
          <Input
            id="filterValue"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={placeHolder ? t(placeHolder) : ""}
            value={localFilterValue || ""}
            onChange={handleFilterChange}
          />
          <PopoverClose asChild>
            <Button
              variant="default"
              className="bg-blue-600 text-white w-full mt-3"
              type="submit"
            >
              {<FormattedMessage id="apply" />}
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
