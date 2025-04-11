"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn, getDatePeriods } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { format, isAfter, isBefore, parse, startOfDay } from "date-fns"
import { CalendarDays, CalendarIcon, CheckIcon } from "lucide-react"
import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
  onChange?: (value: string) => void
}

export function ReportFilterDate({ onChange }: Props) {
  const months: DatePeriod[] = getDatePeriods(12)
  const defaultMonth = months[0]

  const { t } = useTranslation()
  const [range, setRange] = useState(defaultMonth.label)
  const [fromDate, setFromDate] = React.useState<string | undefined>(
    format(defaultMonth.from, "dd/MM/yyyy")
  )
  const [toDate, setToDate] = React.useState<string | undefined>(
    format(defaultMonth.to, "dd/MM/yyyy")
  )
  const [error, setError] = React.useState<string | null>(null)
  const today = React.useMemo(() => startOfDay(new Date()), [])

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
      setRange("")
    },
    [fromDate, toDate, t]
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
      onChange?.([fromDate, toDate].join(","))
    }
  }, [fromDate, toDate, t])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarDays />
          {range ? (
            <span>{range}</span>
          ) : (
            <>
              {fromDate && toDate
                ? `${fromDate} - ${toDate}`
                : fromDate
                ? `${t("from")} ${fromDate}`
                : toDate
                ? `${t("to")} ${toDate}`
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
            <Label htmlFor="date-to" className="my-2">
              <FormattedMessage id="period" />
            </Label>
            <Select>
              <SelectTrigger aria-label={t("select_period")}>
                <SelectValue placeholder={t("select_period")} />
              </SelectTrigger>
              <SelectContent position="popper">
                <Command>
                  <CommandList>
                    <CommandGroup heading="" className="p-3">
                      {months.map(({ label, from, to }) => (
                        <CommandItem
                          key={label}
                          onSelect={() => {
                            setRange(label)
                            setFromDate(format(from, "dd/MM/yyyy"))
                            setToDate(format(to, "dd/MM/yyyy"))
                            onChange?.(
                              [
                                format(from, "dd/MM/yyyy"),
                                format(to, "dd/MM/yyyy"),
                              ].join(",")
                            )
                          }}
                          className="cursor-pointer flex items-center justify-between"
                        >
                          {label}
                          {range === label && (
                            <CheckIcon className="mr-2 h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
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
              />
            </PopoverContent>
          </Popover>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 mt-2">
            <PopoverClose asChild>
              <Button variant="default" className="w-full" type="submit">
                <FormattedMessage id="apply" />
              </Button>
            </PopoverClose>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
