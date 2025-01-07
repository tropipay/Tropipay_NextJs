import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import * as React from "react"

import { Column } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import useFiltersManager from "@/hooks/useFiltersManager"
import { cn } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { CalendarIcon } from "lucide-react"
import { FormattedMessage } from "react-intl"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

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
  const { initialSelected, values, setValues, onSubmit, setParam } =
    useFiltersManager({
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
          {initialSelected?.from || initialSelected?.to ? (
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
          {initialSelected?.from || initialSelected?.to ? (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {`desde ${
                  initialSelected?.from
                    ? format(initialSelected.from, "dd/MM/yyyy")
                    : "..."
                } al ${
                  initialSelected?.to
                    ? format(initialSelected.to, "dd/MM/yyyy")
                    : "..."
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
                <SelectValue placeholder={<FormattedMessage id="select" />} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0"><FormattedMessage id="today" /></SelectItem>
                <SelectItem value="1"><FormattedMessage id="tomorrow" /></SelectItem>
                <SelectItem value="3"><FormattedMessage id="in_3_days" /></SelectItem>
                <SelectItem value="7"><FormattedMessage id="in_a_week" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label htmlFor="width" className="my-3 mt-3">
            <FormattedMessage id="from" />
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
                    <span>
                      <FormattedMessage id="pick_a_date" />
                    </span>
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
            <FormattedMessage id="to" />
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
                    <span>
                      <FormattedMessage id="pick_a_date" />
                    </span>
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
                {<FormattedMessage id="apply" />}
              </Button>
            </PopoverClose>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
