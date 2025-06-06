"use client"

import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import { Label } from "@/components/ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/utils/data/utils"
import { callPostHog } from "@/utils/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
} from "date-fns"
import { CalendarIcon, Eraser } from "lucide-react"
import { usePostHog } from "posthog-js/react" // Importar usePostHog
import React from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"

interface ColumnConfig {
  filterLabel?: string
}

interface DataTableFilterDateProps<TData, TValue> {
  tableId: string
  column?: Column<TData, TValue>
  defaultOpenFilterOptions?: boolean
  activeFilter?: boolean
  onClear?: (filterId: string) => void
}

export function DataTableFilterDate<TData, TValue>({
  tableId, // Receive tableId
  column,
  defaultOpenFilterOptions = false,
  activeFilter,
  onClear,
}: DataTableFilterDateProps<TData, TValue>) {
  const { t } = useTranslation()
  const postHog = usePostHog()
  const [selectedValue, setSelectedValue] = React.useState<string>("")
  const [fromDate, setFromDate] = React.useState<string | undefined>(undefined)
  const [toDate, setToDate] = React.useState<string | undefined>(undefined)
  const [error, setError] = React.useState<string | null>(null)
  //@ts-ignore
  const { filterLabel = "date" } = column?.config || {}
  const [open, setOpen] = React.useState(defaultOpenFilterOptions || false)
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const todayFormatted = React.useMemo(
    () => format(today, "dd/MM/yyyy"),
    [today]
  )

  // Obtener valor actual del filtro
  const filterValue = column?.getFilterValue() as string | undefined
  const [initialFrom, initialTo] = React.useMemo(
    () => filterValue?.split(",") || [],
    [filterValue]
  )

  // Sincronizar estado inicial
  React.useEffect(() => {
    setFromDate(initialFrom)
    setToDate(initialTo)
  }, [initialFrom, initialTo])

  // Determinar período seleccionado
  const getPeriodFromDates = React.useCallback(
    (from: string | undefined, to: string | undefined): string => {
      if (!from || !to) return ""
      if (from === todayFormatted && to === todayFormatted) return "1" // Hoy
      if (
        from === format(addDays(today, -7), "dd/MM/yyyy") &&
        to === todayFormatted
      )
        return "2" // Última semana
      if (
        from === format(addMonths(today, -1), "dd/MM/yyyy") &&
        to === todayFormatted
      )
        return "3" // Último mes
      if (
        from === format(addMonths(today, -6), "dd/MM/yyyy") &&
        to === todayFormatted
      )
        return "4" // Últimos 6 meses
      return ""
    },
    [today, todayFormatted]
  )

  React.useEffect(() => {
    setSelectedValue(getPeriodFromDates(fromDate, toDate))
  }, [fromDate, toDate, getPeriodFromDates])

  // Manejo de fechas
  const handleDateChange = React.useCallback(
    (key: "from" | "to", selectedDate: Date | undefined) => {
      if (!selectedDate) {
        key === "from" ? setFromDate(undefined) : setToDate(undefined)
        setError(null)
        return
      }

      const formattedDate = format(selectedDate, "dd/MM/yyyy")
      const fromParsed = fromDate
        ? parse(fromDate, "dd/MM/yyyy", new Date())
        : null
      const toParsed = toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : null

      if (key === "from" && toParsed && isAfter(selectedDate, toParsed)) {
        setError(t("error_bad_period"))
        return
      } else if (
        key === "to" &&
        fromParsed &&
        isBefore(selectedDate, fromParsed)
      ) {
        setError(t("error_bad_period"))
        return
      }

      setError(null)
      key === "from" ? setFromDate(formattedDate) : setToDate(formattedDate)
    },
    [fromDate, toDate, t]
  )

  // Aplicar y limpiar filtros
  const handleApplyFilter = React.useCallback(() => {
    const fromParsed = fromDate ? parse(fromDate, "dd/MM/yyyy", new Date()) : ""
    const toParsed = toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : ""
    if (fromParsed && toDate && isAfter(fromParsed, toParsed)) {
      setError(t("error_bad_period"))
      return
    }

    setError(null)
    const appliedValue =
      fromDate || toDate ? [fromDate, toDate].join(",") : undefined
    callPostHog(postHog, "filter_date:apply", {
      table_id: tableId,
      filter_id: column?.id,
      filter_type: "date",
      filter_value: appliedValue,
      active_filter: activeFilter,
    })
    column?.setFilterValue(appliedValue)
  }, [column, fromDate, toDate, t, postHog, tableId])

  const handleClearFilter = React.useCallback(() => {
    if (!column) return
    if (filterValue) {
      callPostHog(postHog, "filter_date:_clear", {
        table_id: tableId,
        filter_id: column.id,
        filter_value: filterValue,
        filter_type: "date",
        active_filter: activeFilter,
      })
      setFromDate(undefined)
      setToDate(undefined)
      setSelectedValue("")
      setError(null)
      column?.setFilterValue(undefined)
    } else onClear?.(column.id)
  }, [column, filterValue, onClear, postHog, tableId]) // Add dependencies

  // Manejo de períodos predefinidos
  const handlePeriodChange = React.useCallback(
    (value: string) => {
      setSelectedValue(value)

      callPostHog(postHog, "filter_date:select_period", {
        table_id: tableId,
        filter_id: column?.id,
        period_value: value,
      })

      switch (value) {
        case "1": // Hoy
          setFromDate(todayFormatted)
          setToDate(todayFormatted)
          break
        case "2": // Última semana
          setFromDate(format(addDays(today, -7), "dd/MM/yyyy"))
          setToDate(todayFormatted)
          break
        case "3": // Último mes
          setFromDate(format(addMonths(today, -1), "dd/MM/yyyy"))
          setToDate(todayFormatted)
          break
        case "4": // Últimos 6 meses
          setFromDate(format(addMonths(today, -6), "dd/MM/yyyy"))
          setToDate(todayFormatted)
          break
        default:
          setFromDate(undefined)
          setToDate(undefined)
          break
      }
      setError(null)
    },
    [today, todayFormatted]
  )

  // Deshabilitar fechas
  const disableFutureDates = React.useCallback(
    (date: Date) => isAfter(date, today),
    [today]
  )
  const disableBeforeFromDate = React.useCallback(
    (date: Date) =>
      fromDate
        ? isBefore(date, parse(fromDate, "dd/MM/yyyy", new Date()))
        : false,
    [fromDate]
  )
  const disableAfterToDate = React.useCallback(
    (date: Date) =>
      toDate ? isAfter(date, parse(toDate, "dd/MM/yyyy", new Date())) : false,
    [toDate]
  )

  if (!column) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        data-test-id="dataTableFilterDate-popoverTrigger-openFilter"
      >
        <Button
          variant={filterValue ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
          aria-label={t(filterLabel)}
        >
          <FormattedMessage id={filterLabel} />
          {filterValue && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              <span className="truncate">
                {initialFrom && initialTo
                  ? `${initialFrom} - ${initialTo}`
                  : initialFrom
                  ? `${t("from")} ${initialFrom}`
                  : initialTo
                  ? `${t("to")} ${initialTo}`
                  : null}
              </span>
            </>
          )}
          {/* Updated data-test-id for the clear filter icon container */}
          <div
            data-test-id="dataTableFilterDate-div-clearFilter"
            onClick={(e) => {
              e.stopPropagation()
              handleClearFilter()
            }}
          >
            {filterValue ? (
              <Eraser className="h-4 w-4" />
            ) : (
              <CrossCircledIcon className="h-4 w-4" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[264px] p-6" align="start">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleApplyFilter()
          }}
        >
          <div className="mb-2">
            <Select value={selectedValue} onValueChange={handlePeriodChange}>
              <SelectTrigger
                aria-label={t("select_period")}
                data-test-id="dataTableFilterDate-selectTrigger-selectPeriod"
              >
                <SelectValue placeholder={t("select_period")} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem
                  value="1"
                  data-test-id="dataTableFilterDate-selectItem-period-1"
                >
                  <FormattedMessage id="today" />
                </SelectItem>
                <SelectItem
                  value="2"
                  data-test-id="dataTableFilterDate-selectItem-period-2"
                >
                  <FormattedMessage id="last_week" />
                </SelectItem>
                <SelectItem
                  value="3"
                  data-test-id="dataTableFilterDate-selectItem-period-3"
                >
                  <FormattedMessage id="last_month" />
                </SelectItem>
                <SelectItem
                  value="4"
                  data-test-id="dataTableFilterDate-selectItem-period-4"
                >
                  <FormattedMessage id="last_six_months" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label htmlFor="date-from" className="my-2">
            <FormattedMessage id="from" />
          </Label>
          <Popover>
            <PopoverTrigger
              asChild
              data-test-id="dataTableFilterDate-popoverTrigger-openDateFrom"
            >
              <Button
                id="date-from"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full mb-3",
                  !fromDate && "text-muted-foreground"
                )}
                aria-label={fromDate ? fromDate : t("pick_a_date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? (
                  <div className="flex justify-between w-full">
                    {fromDate}
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDateChange("from", undefined)
                      }}
                      className="ml-2 text-sm"
                      data-test-id="dataTableFilterDate-span-clearDateFrom"
                    >
                      <FormattedMessage id="clear" />
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
                  fromDate ? parse(fromDate, "dd/MM/yyyy", new Date()) : today
                }
                selected={
                  fromDate
                    ? parse(fromDate, "dd/MM/yyyy", new Date())
                    : undefined
                }
                onSelect={(date) => handleDateChange("from", date)}
                disabled={(date) =>
                  disableFutureDates(date) || disableAfterToDate(date)
                }
              />
            </PopoverContent>
          </Popover>
          <Label htmlFor="date-to" className="my-2">
            <FormattedMessage id="to" />
          </Label>
          <Popover>
            <PopoverTrigger
              asChild
              data-test-id="dataTableFilterDate-popoverTrigger-openDateTo"
            >
              <Button
                id="date-to"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full mb-3",
                  !toDate && "text-muted-foreground"
                )}
                aria-label={toDate ? toDate : t("pick_a_date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? (
                  <div className="flex justify-between w-full">
                    {toDate}
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDateChange("to", undefined)
                      }}
                      className="ml-2 text-sm"
                      data-test-id="dataTableFilterDate-span-clearDateTo"
                    >
                      <FormattedMessage id="clear" />
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
                  toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : today
                }
                selected={
                  toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : undefined
                }
                onSelect={(date) => handleDateChange("to", date)}
                disabled={(date) =>
                  disableFutureDates(date) || disableBeforeFromDate(date)
                }
              />
            </PopoverContent>
          </Popover>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 mt-2">
            <PopoverClose asChild>
              {/* Added data-test-id to the apply filter button */}
              <Button
                variant="default"
                className="w-full"
                type="submit"
                data-test-id="dataTableFilterDate-button-applyFilter" // Updated data-test-id
              >
                <FormattedMessage id="apply" />
              </Button>
            </PopoverClose>
            {/* Opcional: Botón Cancelar */}
            {/* <PopoverClose asChild>
              <Button variant="outline" className="w-full">
                <FormattedMessage id="cancel" />
              </Button>
            </PopoverClose> */}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
