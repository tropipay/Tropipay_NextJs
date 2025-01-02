import * as React from "react"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import useFiltersManager from "@/hooks/useFiltersManager"
import { PopoverClose } from "@radix-ui/react-popover"

interface DataTableFilterRangeAmountProps<TData, TValue> {
  column?: Column<TData, TValue>
  label?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFilterRangeAmount<TData, TValue>({
  column,
  label,
  options,
}: DataTableFilterRangeAmountProps<TData, TValue>) {
  const { initialSelected, values, updateValues, onSubmit } = useFiltersManager(
    {
      column,
    }
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {label}
          {initialSelected?.lenght > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {initialSelected?.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {initialSelected?.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {initialSelected?.length} {"Selected"}
                  </Badge>
                ) : (
                  options
                    .filter((option) => initialSelected.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={onSubmit}>
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              {label}
            </Label>
          </div>
          <Label htmlFor="width">Desde</Label>
          <Input
            id="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder="Ingrese el Card BIN"
            value={values.min || ""}
            onChange={updateValues}
          />
          <Label htmlFor="width">Hasta</Label>
          <Input
            id="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder="Ingrese el Card BIN"
            value={values.max || ""}
            onChange={updateValues}
          />
          <PopoverClose asChild>
            <div className="py-2">
              <PopoverClose asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 text-white w-full"
                  type="submit"
                >
                  Aplicar
                </Button>
              </PopoverClose>
            </div>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
