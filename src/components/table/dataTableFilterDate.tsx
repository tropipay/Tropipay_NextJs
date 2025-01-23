import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  startOfDay,
  isSameDay,
} from "date-fns"
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
  const [selectedValue, setSelectedValue] = React.useState("")
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined)
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined)
  const [error, setError] = React.useState<string | null>(null)

  const { label } = column.config.filter

  // Función para verificar si las fechas corresponden a un período
  const checkPeriod = (
    from: Date | undefined,
    to: Date | undefined
  ): string | undefined => {
    const today = startOfDay(new Date())

    if (from && to) {
      if (isSameDay(from, today) && isSameDay(to, today)) {
        return "1" // Hoy
      } else if (isSameDay(from, addDays(today, -7)) && isSameDay(to, today)) {
        return "2" // Última semana
      } else if (
        isSameDay(from, addMonths(today, -1)) &&
        isSameDay(to, today)
      ) {
        return "3" // Último mes
      } else if (
        isSameDay(from, addMonths(today, -6)) &&
        isSameDay(to, today)
      ) {
        return "4" // Últimos 6 meses
      }
    }
    return undefined // No coincide con ningún período
  }

  const handleDateChange = (
    key: "from" | "to",
    selectedDate: Date | undefined
  ) => {
    if (key === "from") {
      if (selectedDate && toDate && isAfter(selectedDate, toDate)) {
        setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.")
        setFromDate(toDate)
      } else {
        setError(null)
        setFromDate(selectedDate)
      }
    } else if (key === "to") {
      if (selectedDate && fromDate && isBefore(selectedDate, fromDate)) {
        setError("La fecha 'Hasta' no puede ser menor que la fecha 'Desde'.")
        setToDate(fromDate)
      } else {
        setError(null)
        setToDate(selectedDate)
      }
    }

    // Verificar si las fechas corresponden a un período
    const period = checkPeriod(
      key === "from" ? selectedDate : fromDate,
      key === "to" ? selectedDate : toDate
    )
    setSelectedValue(period || "")
  }

  const handleApplyFilter = () => {
    if (fromDate && toDate && isAfter(fromDate, toDate)) {
      setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.")
      return
    }
    setError(null)
    column?.setFilterValue({ from: fromDate, to: toDate })
  }

  const handleClearFilter = () => {
    column?.setFilterValue(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    setError(null)
    setSelectedValue("") // Limpiar la selección del período
  }

  const filterValue = column?.getFilterValue() as
    | { from?: Date; to?: Date }
    | undefined

  const disableFutureDates = (date: Date) => {
    return isAfter(date, new Date())
  }

  // Función para manejar el cambio de período
  const handlePeriodChange = (value: string) => {
    setSelectedValue(value)
    const today = startOfDay(new Date())

    switch (value) {
      case "1": // Hoy
        setFromDate(today)
        setToDate(today)
        break
      case "2": // Última semana
        setFromDate(addDays(today, -7))
        setToDate(today)
        break
      case "3": // Último mes
        setFromDate(addMonths(today, -1))
        setToDate(today)
        break
      case "4": // Últimos 6 meses
        setFromDate(addMonths(today, -6))
        setToDate(today)
        break
      default:
        setFromDate(undefined)
        setToDate(undefined)
        break
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={filterValue?.from || filterValue?.to ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {filterValue?.from || filterValue?.to ? (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {filterValue?.from && filterValue?.to
                ? `${format(filterValue.from, "dd/MM/yyyy")} | ${format(
                    filterValue.to,
                    "dd/MM/yyyy"
                  )}`
                : null}
              {filterValue?.from && !filterValue?.to
                ? `Desde ${format(filterValue.from, "dd/MM/yyyy")}`
                : null}
              {!filterValue?.from && filterValue?.to
                ? `Hasta ${format(filterValue.to, "dd/MM/yyyy")}`
                : null}
            </>
          ) : null}
          {filterValue?.from || filterValue?.to ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                handleClearFilter()
              }}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </div>
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
          <div className="mb-2">
            <Select value={selectedValue} onValueChange={handlePeriodChange}>
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
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {fromDate ? (
                    <div className="flex justify-between w-full">
                      {format(fromDate, "dd/MM/yyyy")}
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDateChange("from", undefined)
                        }}
                      >
                        Borrar
                      </span>
                    </div>
                  ) : (
                    <span>
                      <FormattedMessage id="pick_a_date" />
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <PopoverClose asChild>
                  <div>
                    <Calendar
                      mode="single"
                      initialFocus
                      defaultMonth={fromDate}
                      selected={fromDate}
                      onSelect={(selectedDate) => {
                        handleDateChange("from", selectedDate)
                      }}
                      disabled={disableFutureDates}
                    />
                  </div>
                </PopoverClose>
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
                    !toDate && "text-muted-foreground border-selected"
                  )}
                >
                  <CalendarIcon />
                  {toDate ? (
                    <div className="flex justify-between w-full">
                      {format(toDate, "dd/MM/yyyy")}
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDateChange("to", undefined)
                        }}
                      >
                        Borrar
                      </span>
                    </div>
                  ) : (
                    <span>
                      <FormattedMessage id="pick_a_date" />
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <PopoverClose asChild>
                  <div>
                    <Calendar
                      mode="single"
                      initialFocus
                      defaultMonth={toDate}
                      selected={toDate}
                      onSelect={(selectedDate) => {
                        handleDateChange("to", selectedDate)
                      }}
                      disabled={disableFutureDates}
                    />
                  </div>
                </PopoverClose>
              </PopoverContent>
            </Popover>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
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
