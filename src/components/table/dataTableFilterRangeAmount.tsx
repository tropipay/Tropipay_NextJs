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
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {label}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {"Selected"}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
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
        <div className="pb-4">
          <Label htmlFor="width" className="font-bold">
            {label}
          </Label>
        </div>
        <Label htmlFor="width">Desde</Label>
        <Input
          id="width"
          className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
          placeholder="Ingrese el Card BIN"
        />
        <Label htmlFor="width">Hasta</Label>
        <Input
          id="width"
          className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
          placeholder="Ingrese el Card BIN"
        />
        <Button
          variant="default"
          className="bg-blue-600 text-white w-full mt-3"
        >
          Aplicar
        </Button>
      </PopoverContent>
    </Popover>
  )
}
