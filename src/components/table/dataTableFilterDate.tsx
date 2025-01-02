import * as React from "react"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { format, addDays } from "date-fns"

import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { PopoverClose } from "@radix-ui/react-popover"
import useFiltersManager from "@/hooks/useFiltersManager"

interface DataTableFilterDateProps<TData, TValue> {
  column?: Column<TData, TValue>
  label?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFilterDate<TData, TValue>({
  column,
  label,
  options,
}: DataTableFilterDateProps<TData, TValue>) {
  const { initialSelected, values, setValues, onSubmit } = useFiltersManager({
    column,
  })

  const handleDateChange = (
    key: "from" | "to",
    selectedDate: Date | undefined
  ) => {
    const currentValue = { ...values }
    currentValue[key] = selectedDate
    const filteredValues = Object.fromEntries(
      Object.entries(currentValue).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    )
    setValues(filteredValues)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {label}
          {initialSelected?.from || initialSelected?.to ? (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {`${
                  initialSelected?.from
                    ? format(initialSelected.from, "dd/MM/yyyy")
                    : ""
                } - ${
                  initialSelected?.to
                    ? format(initialSelected.to, "dd/MM/yyyy")
                    : ""
                }`}
              </Badge>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={onSubmit}>
          <div className="mb-2">
            <Select
              onValueChange={(value) =>
                handleDateChange("from", addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label htmlFor="width" className="my-3 mt-3">
            Desde:
          </Label>
          <div className="mb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal w-full mt-3 mb-3",
                    !values && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {values?.from ? (
                    format(values.from, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  initialFocus
                  defaultMonth={values?.from}
                  selected={values?.from}
                  onSelect={(selectedDate) =>
                    handleDateChange("from", selectedDate)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <Label htmlFor="width" className="my-3">
            Hasta:
          </Label>
          <div className="">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal w-full mt-3 mb-3",
                    !values && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {values?.to ? (
                    format(values.to, "dd/MM/yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  initialFocus
                  defaultMonth={values?.to}
                  selected={values?.to}
                  onSelect={(selectedDate) =>
                    handleDateChange("to", selectedDate)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
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
        </form>
      </PopoverContent>
    </Popover>
  )
}
