import * as React from "react"
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons"
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

interface DataTableFilterSingleValueProps<TData, TValue> {
  column?: Column<TData, TValue>
  label?: string
  placeHolder: string
}

export function DataTableFilterSingleValue<TData, TValue>({
  column,
  label,
  placeHolder,
}: DataTableFilterSingleValueProps<TData, TValue>) {
  const { initialSelected, values, updateValues, onSubmit, setParam } =
    useFiltersManager({
      column,
    })

  console.log("initialSelected:", initialSelected)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          {initialSelected?.data ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                setParam(column.id, null)
              }}
            >
              <MinusCircledIcon className="h-4 w-4" />
            </div>
          ) : (
            <PlusCircledIcon className="h-4 w-4" />
          )}
          {label}
          {!!initialSelected.data && (
            <>
              <Separator orientation="vertical" className=" h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {initialSelected.data}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={onSubmit}>
          <Label htmlFor="filterValue" className="my-2">
            {label}
          </Label>
          <Input
            id="data"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={placeHolder}
            value={values.data || ""}
            onChange={updateValues}
          />
          <PopoverClose asChild>
            <Button
              variant="default"
              className="bg-blue-600 text-white w-full mt-3"
              type="submit"
            >
              Aplicar
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
