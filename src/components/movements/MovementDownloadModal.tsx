import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { cn } from "@/utils/data/utils"
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
} from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"

interface Props {
  open?: boolean
  onClose?: () => void
  onDownload?: (
    reportType: string,
    reportFormat: string,
    fromDate?: string,
    endDate?: string
  ) => void
}

const MovementDownloadDialog = ({
  open = false,
  onClose,
  onDownload,
}: Props) => {
  const { t } = useTranslation()

  const [movementType, setMovementType] = useState<string>("all")
  const [selectedValue, setSelectedValue] = React.useState<string>("")
  const [fromDate, setFromDate] = React.useState<string | undefined>(undefined)
  const [toDate, setToDate] = React.useState<string | undefined>(undefined)
  const [reportFormat, setReportFormat] = useState<string>("csv")
  const [error, setError] = React.useState<string | null>(null)

  const today = React.useMemo(() => startOfDay(new Date()), [])
  const todayFormatted = React.useMemo(
    () => format(today, "dd/MM/yyyy"),
    [today]
  )

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

  // Manejo de períodos predefinidos
  const handlePeriodChange = React.useCallback(
    (value: string) => {
      setSelectedValue(value)

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

  const handleDownload = () => {
    onDownload?.(
      movementType !== "all" ? "FILTERED_MOVEMENTS" : "ALL_MOVEMENTS",
      reportFormat,
      fromDate,
      toDate
    )
    onClose?.()
  }

  useEffect(() => {
    setSelectedValue(getPeriodFromDates(fromDate, toDate))
  }, [fromDate, toDate, getPeriodFromDates])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose?.() // Se ejecuta solo al cerrar
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="download" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all_movements"
                name="movement_type"
                value="all"
                className="h-4 w-4"
                checked={movementType === "all"}
                onChange={() => setMovementType("all")}
              />
              <label
                htmlFor="all_movements"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <FormattedMessage id="all_movements" />
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="filtered_movements"
                name="movement_type"
                value="filtered"
                className="h-4 w-4"
                checked={movementType === "filtered"}
                onChange={() => setMovementType("filtered")}
              />
              <label
                htmlFor="filtered_movements"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <FormattedMessage id="filtered_movements" />
              </label>
            </div>
          </div>

          {movementType !== "all" && (
            <>
              <div className="mb-2">
                <Select
                  value={selectedValue}
                  onValueChange={handlePeriodChange}
                >
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
              <>
                <Label htmlFor="date-from" className="my-2">
                  <FormattedMessage id="from" />
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
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
                        fromDate
                          ? parse(fromDate, "dd/MM/yyyy", new Date())
                          : today
                      }
                      selected={
                        fromDate
                          ? parse(fromDate, "dd/MM/yyyy", new Date())
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("from", date)}
                    />
                  </PopoverContent>
                </Popover>
              </>

              <>
                <Label htmlFor="date-to" className="my-2">
                  <FormattedMessage id="to" />
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
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
                        toDate
                          ? parse(toDate, "dd/MM/yyyy", new Date())
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("to", date)}
                    />
                  </PopoverContent>
                </Popover>
              </>
            </>
          )}

          <div className="mb-4">
            <Label className="mt-4">
              <FormattedMessage id="file_format" />
            </Label>
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xls">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => onClose?.()}>
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            variant={"default"}
            onClick={handleDownload}
            disabled={
              !reportFormat ||
              (movementType !== "all" && (!fromDate || !toDate))
            }
          >
            <FormattedMessage id="download" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MovementDownloadDialog
