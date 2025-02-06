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
  parse,
} from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useEffect } from "react"
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
  const [fromDate, setFromDate] = React.useState<string | undefined>(undefined)
  const [toDate, setToDate] = React.useState<string | undefined>(undefined)
  const [error, setError] = React.useState<string | null>(null)

  const { label } = column?.config?.filter || { label: "Filtrar por fecha" }

  // Función para verificar si las fechas corresponden a un período
  const checkPeriod = (
    from: string | undefined,
    to: string | undefined
  ): string | undefined => {
    const today = startOfDay(new Date())
    const todayFormatted = format(today, "dd/MM/yyyy")

    if (from && to) {
      if (from === todayFormatted && to === todayFormatted) {
        return "1" // Hoy
      } else if (
        from === format(addDays(today, -7), "dd/MM/yyyy") &&
        to === todayFormatted
      ) {
        return "2" // Última semana
      } else if (
        from === format(addMonths(today, -1), "dd/MM/yyyy") &&
        to === todayFormatted
      ) {
        return "3" // Último mes
      } else if (
        from === format(addMonths(today, -6), "dd/MM/yyyy") &&
        to === todayFormatted
      ) {
        return "4" // Últimos 6 meses
      }
    }
    return undefined // No coincide con ningún período
  }

  // Efecto para actualizar el período seleccionado cuando las fechas cambien
  useEffect(() => {
    const period = checkPeriod(fromDate, toDate)
    setSelectedValue(period || "")
  }, [fromDate, toDate])

  const handleDateChange = (
    key: "from" | "to",
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy")

      if (key === "from") {
        if (
          toDate &&
          isAfter(selectedDate, parse(toDate, "dd/MM/yyyy", new Date()))
        ) {
          setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.")
          setFromDate(toDate)
        } else {
          setError(null)
          setFromDate(formattedDate)
        }
      } else if (key === "to") {
        if (
          fromDate &&
          isBefore(selectedDate, parse(fromDate, "dd/MM/yyyy", new Date()))
        ) {
          setError("La fecha 'Hasta' no puede ser menor que la fecha 'Desde'.")
          setToDate(fromDate)
        } else {
          setError(null)
          setToDate(formattedDate)
        }
      }
    } else {
      if (key === "from") {
        setFromDate(undefined)
      } else if (key === "to") {
        setToDate(undefined)
      }
    }
  }

  const handleApplyFilter = () => {
    if (
      fromDate &&
      toDate &&
      isAfter(
        parse(fromDate, "dd/MM/yyyy", new Date()),
        parse(toDate, "dd/MM/yyyy", new Date())
      )
    ) {
      setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.")
      return
    }
    setError(null)

    // Pasar las fechas formateadas al filtro
    const serializedValue = [fromDate, toDate].join(",")
    column?.setFilterValue(serializedValue)
  }

  const handleClearFilter = () => {
    // Limpiar el filtro en el estado
    column?.setFilterValue(undefined)
    setFromDate(undefined)
    setToDate(undefined)
    setError(null)
    setSelectedValue("")
  }

  // Función para deshabilitar fechas futuras
  const disableFutureDates = (date: Date) => {
    return isAfter(date, new Date())
  }

  // Función para deshabilitar fechas anteriores a `from` en el calendario de `to`
  const disableBeforeFromDate = (date: Date) => {
    return fromDate
      ? isBefore(date, parse(fromDate, "dd/MM/yyyy", new Date()))
      : false
  }

  // Función para deshabilitar fechas posteriores a `to` en el calendario de `from`
  const disableAfterToDate = (date: Date) => {
    return toDate
      ? isAfter(date, parse(toDate, "dd/MM/yyyy", new Date()))
      : false
  }

  // Función para manejar el cambio de período
  const handlePeriodChange = (value: string) => {
    setSelectedValue(value)
    const today = startOfDay(new Date())

    switch (value) {
      case "1": // Hoy
        setFromDate(format(today, "dd/MM/yyyy"))
        setToDate(format(today, "dd/MM/yyyy"))
        break
      case "2": // Última semana
        setFromDate(format(addDays(today, -7), "dd/MM/yyyy"))
        setToDate(format(today, "dd/MM/yyyy"))
        break
      case "3": // Último mes
        setFromDate(format(addMonths(today, -1), "dd/MM/yyyy"))
        setToDate(format(today, "dd/MM/yyyy"))
        break
      case "4": // Últimos 6 meses
        setFromDate(format(addMonths(today, -6), "dd/MM/yyyy"))
        setToDate(format(today, "dd/MM/yyyy"))
        break
      default:
        setFromDate(undefined)
        setToDate(undefined)
        break
    }
  }

  const filterValue = column?.getFilterValue()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={filterValue ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {filterValue && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {(() => {
                const [from, to] = filterValue.split(",")
                return (
                  <>
                    {from && to ? `${from} - ${to}` : null}
                    {from && !to ? `Desde ${from}` : null}
                    {!from && to ? `Hasta ${to}` : null}
                  </>
                )
              })()}
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
      </PopoverTrigger>{" "}
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
                  id="date-from"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal w-full mt-3 mb-3 p-3",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {fromDate ? (
                    <div className="flex justify-between w-full">
                      {fromDate}
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
                <Calendar
                  mode="single"
                  initialFocus
                  defaultMonth={
                    fromDate
                      ? parse(fromDate, "dd/MM/yyyy", new Date())
                      : undefined
                  }
                  selected={
                    fromDate
                      ? parse(fromDate, "dd/MM/yyyy", new Date())
                      : undefined
                  }
                  onSelect={(selectedDate) => {
                    handleDateChange("from", selectedDate)
                    document.getElementById("close-popover-from")?.click()
                  }}
                  disabled={(date) =>
                    disableFutureDates(date) || disableAfterToDate(date)
                  }
                />
                <PopoverClose id="close-popover-from" className="hidden" />
              </PopoverContent>
            </Popover>{" "}
          </div>
          <Label htmlFor="width" className="my-3">
            <FormattedMessage id="to" />
          </Label>
          <div className="">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-to"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal w-full mt-3 mb-3 p-3",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {toDate ? (
                    <div className="flex justify-between w-full">
                      {toDate}
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
                <Calendar
                  mode="single"
                  initialFocus
                  defaultMonth={
                    toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : undefined
                  }
                  selected={
                    toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : undefined
                  }
                  onSelect={(selectedDate) => {
                    handleDateChange("to", selectedDate)
                    document.getElementById("close-popover-to")?.click()
                  }}
                  disabled={(date) =>
                    disableFutureDates(date) || disableBeforeFromDate(date)
                  }
                />
                <PopoverClose id="close-popover-to" className="hidden" />
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
