import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import useFiltersManager from "@/hooks/useFiltersManager"
import { cn, selStyle } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { addDays, addMonths, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"
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
}

export function DataTableFilterDate<TData, TValue>({
  column,
}: DataTableFilterDateProps<TData, TValue>) {
  const { initialSelected, values, setValues, onSubmit, setParams } =
    useFiltersManager({
      column,
    })

  const [selectedValue, setSelectedValue] = React.useState("")
  const label = (column as any)?.filter?.label || ""

  const handleDateChange = (
    key: "from" | "to",
    selectedDate: Date | undefined
  ) => {
    const currentValue = { ...values }
    currentValue[key as any] = selectedDate as any
    const filteredValues = Object.fromEntries(
      Object.entries(currentValue).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    )
    setValues(filteredValues as any)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(
            initialSelected?.from || initialSelected?.to,
            "active",
            "inactive",
            ""
          )}
          size="sm"
          className="px-2 h-8 "
        >
          {label}
          {initialSelected?.from || initialSelected?.to ? (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {initialSelected?.from && initialSelected?.to
                ? `${format(initialSelected.from, "dd/MM/yyyy")} | ${format(
                    initialSelected.to,
                    "dd/MM/yyyy"
                  )}`
                : null}
              {initialSelected?.from && !initialSelected?.to
                ? `Desde ${format(initialSelected.from, "dd/MM/yyyy")}`
                : null}
              {!initialSelected?.from && initialSelected?.to
                ? `Hasta ${format(initialSelected.to, "dd/MM/yyyy")}`
                : null}
            </>
          ) : null}
          {initialSelected?.from || initialSelected?.to ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                setParams({ [column?.id ?? ""]: null })
              }}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={onSubmit}>
          <div className="mb-2">
            <Select
              value={selectedValue}
              onValueChange={(value) => {
                setSelectedValue(value)
                switch (value) {
                  case "1":
                    handleDateChange("from", new Date())
                    break
                  case "2":
                    handleDateChange("from", addDays(new Date(), -7))
                    break
                  case "3":
                    handleDateChange("from", addMonths(new Date(), -1))
                    break
                  case "4":
                    handleDateChange("from", addMonths(new Date(), -6))
                    break
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el periodo" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="1">Hoy</SelectItem>
                <SelectItem value="2">Última semana</SelectItem>
                <SelectItem value="3">Último mes</SelectItem>
                <SelectItem value="4">Últimos 6 meses</SelectItem>
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
                    "justify-start text-left font-normal w-full mt-3 mb-3 p-3",
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
                    "justify-start text-left font-normal w-full mt-3 mb-3 p-3",
                    !values && "text-muted-foreground border-selected"
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
