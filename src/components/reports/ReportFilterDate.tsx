"use client"

import { Button, Calendar } from "@/components/ui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { cn, getDatePeriods } from "@/utils/data/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { SelectItem } from "@radix-ui/react-select"
import { format, isAfter, isBefore, parse, startOfDay } from "date-fns"
import { CalendarDays, CalendarIcon, CheckIcon } from "lucide-react"
import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { getLocaleStored } from "../intl/utils"
import { Label } from "../ui/Label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/Select"

interface Props {
  onChange?: (value: string) => void
}

export function ReportFilterDate({ onChange }: Props) {
  const { t } = useTranslation()
  const months: DatePeriod[] = getDatePeriods(12, t, getLocaleStored())
  const defaultMonth = months[0]

  const [currentRange, setCurrentRange] = useState<string | undefined>(
    defaultMonth.label
  )
  const [currentFromDate, setCurrentFromDate] = React.useState<
    string | undefined
  >(format(defaultMonth.from, "dd/MM/yyyy"))
  const [currentToDate, setCurrentToDate] = React.useState<string | undefined>(
    format(defaultMonth.to, "dd/MM/yyyy")
  )

  const [range, setRange] = useState<string | undefined>(defaultMonth.label)
  const [fromDate, setFromDate] = React.useState<string | undefined>(
    format(defaultMonth.from, "dd/MM/yyyy")
  )
  const [toDate, setToDate] = React.useState<string | undefined>(
    format(defaultMonth.to, "dd/MM/yyyy")
  )
  const [error, setError] = React.useState<string | null>(null)
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const startDate = React.useMemo(() => startOfDay(new Date(2025, 0, 1)), [])

  const isApplyButtonDisabled = React.useMemo(() => {
    if (!fromDate && !toDate) return true
    const fromParsed = fromDate ? parse(fromDate, "dd/MM/yyyy", new Date()) : ""
    const toParsed = toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : ""
    if (fromParsed && toDate && isAfter(fromParsed, toParsed)) return true
    return false
  }, [fromDate, toDate])

  const handlePeriodChange = (value: string) => {
    const month = months.find(({ label }) => label === value)

    if (!!month) {
      setRange(value)
      setFromDate(format(month.from, "dd/MM/yyyy"))
      setToDate(format(month.to, "dd/MM/yyyy"))
      setError(null)
    }
  }

  const handleDateChange = React.useCallback(
    (key: "from" | "to", selectedDate: Date | undefined) => {
      if (!selectedDate) {
        key === "from" ? setFromDate(undefined) : setToDate(undefined)
        setRange(undefined)
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
      setRange(undefined)
    },
    [fromDate, toDate]
  )

  const handleApplyFilter = React.useCallback(() => {
    const fromParsed = fromDate ? parse(fromDate, "dd/MM/yyyy", new Date()) : ""
    const toParsed = toDate ? parse(toDate, "dd/MM/yyyy", new Date()) : ""
    if (fromParsed && toDate && isAfter(fromParsed, toParsed)) {
      setError(t("error_bad_period"))
      return
    }

    setError(null)

    if (fromDate || toDate) {
      setCurrentRange(range)
      setCurrentFromDate(fromDate)
      setCurrentToDate(toDate)
      onChange?.([fromDate, toDate].join(","))
    }
  }, [fromDate, toDate])

  const disableBefore1rst2025 = React.useCallback(
    (date: Date) => isBefore(date, startDate),
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

  const onOpenChange = (open: boolean) => {
    if (open) {
      const month = months.find(({ label }) => label === currentRange)

      if (!!month) {
        setRange(currentRange)
        setFromDate(format(month.from, "dd/MM/yyyy"))
        setToDate(format(month.to, "dd/MM/yyyy"))
        setError(null)
      }
    }
  }

  return (
    <Popover {...{ onOpenChange }}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarDays />
          {currentRange ? (
            <span>{currentRange}</span>
          ) : (
            <>
              {currentFromDate && currentToDate
                ? `${currentFromDate} - ${currentToDate}`
                : currentFromDate
                ? `${t("from")} ${currentFromDate}`
                : currentToDate
                ? `${t("to")} ${currentToDate}`
                : null}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[324px] p-6" align="start">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleApplyFilter()
          }}
        >
          <h2 className="text-sm font-semibold mb-4 text-gray-500">
            <FormattedMessage id="date" />
          </h2>
          <div className="mb-2">
            <Label className="my-2">
              <FormattedMessage id="period" />
            </Label>
            <Select value={range} onValueChange={handlePeriodChange}>
              <SelectTrigger aria-label={t("select_period")}>
                {!range ? (
                  t("select_period")
                ) : (
                  <SelectValue>{range}</SelectValue>
                )}
              </SelectTrigger>
              <SelectContent position="popper">
                {months.map(({ label }) => (
                  <SelectItem
                    key={label}
                    value={label}
                    className="cursor-pointer flex items-center justify-between p-2"
                  >
                    {label}
                    {range === label && <CheckIcon className="mr-2 h-4 w-4" />}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                  fromDate ? parse(fromDate, "dd/MM/yyyy", new Date()) : today
                }
                selected={
                  fromDate
                    ? parse(fromDate, "dd/MM/yyyy", new Date())
                    : undefined
                }
                onSelect={(date) => handleDateChange("from", date)}
                disabled={(date) =>
                  disableBefore1rst2025(date) || disableAfterToDate(date)
                }
              />
            </PopoverContent>
          </Popover>
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
                  disableBefore1rst2025(date) || disableBeforeFromDate(date)
                }
              />
            </PopoverContent>
          </Popover>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 mt-2">
            <PopoverClose asChild>
              <Button
                variant="default"
                className="w-full"
                type="submit"
                disabled={isApplyButtonDisabled}
              >
                <FormattedMessage id="apply" />
              </Button>
            </PopoverClose>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
