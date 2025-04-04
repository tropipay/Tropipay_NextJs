import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  DownloadIcon,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState, useRef } from "react"
import { FormattedMessage, useIntl } from "react-intl" // Import useIntl
import { DateRange } from "react-day-picker"
import {
  subMonths,
  addDays,
  startOfMonth,
  endOfMonth,
  parse,
  startOfToday,
  endOfToday,
  isSameDay, // Add isSameDay for date comparison without time
} from "date-fns" // Import date-fns functions
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface InformationToolbarProps {
  handleDownload?: () => void // Propiedad opcional para el long click
}

export default function InformationToolbar({
  handleDownload,
}: InformationToolbarProps) {
  const intl = useIntl() // Instantiate useIntl

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Helper function to format date with capitalized short month
  const formatShortDateWithCapitalMonth = (dateToFormat: Date) => {
    const day = intl.formatDate(dateToFormat, { day: "numeric" })
    // Ensure month is treated as string before capitalization
    const month = String(intl.formatDate(dateToFormat, { month: "short" }))
    const year = intl.formatDate(dateToFormat, { year: "numeric" })
    // Remove potential period added by some locales in short month format (e.g., "ene.")
    const cleanMonth = month.endsWith(".") ? month.slice(0, -1) : month
    return `${day} ${capitalizeFirstLetter(cleanMonth)} ${year}`
  }

  const [date, setDate] = useState<DateRange | undefined>(() => {
    // Initialize with the current month
    const today = new Date()
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    }
  })
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date) // Temporary state for custom range picker
  const [selectedMonth, setSelectedMonth] = useState(
    intl.formatMessage({ id: "currentMonth" }) // Updated key
  )
  const [isMonthPopoverOpen, setIsMonthPopoverOpen] = useState(false) // State for month popover
  const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false) // State for custom date popover
  const longPressTimer = useRef<NodeJS.Timeout | null>(null) // Ref for timer

  const currentMonthLabel = intl.formatMessage({ id: "currentMonth" }) // Updated key
  const months = [
    currentMonthLabel,
    ...Array.from({ length: 24 }, (_, i) =>
      intl.formatDate(subMonths(new Date(), i), {
        month: "long",
        year: "numeric",
      })
    ),
  ]

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Popover open={isMonthPopoverOpen} onOpenChange={setIsMonthPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="periodSelector"
              className="flex items-center gap-2"
              onClick={() => setIsMonthPopoverOpen(true)} // Abrir al hacer clic
            >
              <span className="capitalize">{selectedMonth}</span>
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[264px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading="" className="p-3">
                  {months.map((month) => (
                    <CommandItem
                      key={month}
                      onSelect={async () => {
                        // Make async for dynamic import
                        let newDateRange: DateRange | undefined
                        if (month === currentMonthLabel) {
                          const today = new Date()
                          newDateRange = {
                            from: startOfMonth(today),
                            to: endOfMonth(today),
                          }
                        } else {
                          // Parse the month string (e.g., "enero 2024")
                          // Assuming the format is consistent with intl.formatDate
                          // Need to handle locale variations if necessary
                          try {
                            // Attempt parsing, adjust format string as needed based on actual output
                            const parsedDate = parse(
                              month,
                              "LLLL yyyy",
                              new Date(),
                              {
                                locale: intl.locale
                                  ? (
                                      await import(
                                        `date-fns/locale/${intl.locale}`
                                      )
                                    ).default // Use dynamic import
                                  : undefined,
                              }
                            )
                            newDateRange = {
                              from: startOfMonth(parsedDate),
                              to: endOfMonth(parsedDate),
                            }
                          } catch (error) {
                            console.error("Error parsing month:", error)
                            // Fallback or default behavior if parsing fails
                            const today = new Date()
                            newDateRange = {
                              from: startOfMonth(today),
                              to: endOfMonth(today),
                            }
                          }
                        }
                        setDate(newDateRange) // Update main state
                        setSelectedMonth(month)
                        setIsMonthPopoverOpen(false) // Close popover
                      }}
                      className="cursor-pointer capitalize"
                    >
                      {selectedMonth === month && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      {month}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover
          open={isCustomPopoverOpen}
          onOpenChange={setIsCustomPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setTempDate(date) // Initialize tempDate when opening
                setIsCustomPopoverOpen(true)
              }}
              id="customPeriodSelector"
              className="flex items-center gap-2"
            >
              <CalendarIcon size={16} />
              {date?.from ? (
                date.to ? (
                  // Use helper function for date range display
                  <>
                    {formatShortDateWithCapitalMonth(date.from)} -{" "}
                    {formatShortDateWithCapitalMonth(date.to)}
                  </>
                ) : (
                  // Use helper function for single date display
                  formatShortDateWithCapitalMonth(date.from)
                )
              ) : (
                // Use translation for placeholder
                <span>{intl.formatMessage({ id: "pickDate" })}</span> // Updated key
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempDate?.from ?? date?.from} // Use tempDate or fallback to date for initial month
              // selected={date} // Removed duplicate prop
              // onSelect={setDate} // Removed duplicate prop
              numberOfMonths={2}
              selected={tempDate} // Use tempDate for selection
              onSelect={async (newRange) => {
                // Make async for locale import if needed
                setTempDate(newRange) // Update tempDate
                // Close popover automatically if a full range is selected
                if (newRange?.from && newRange?.to) {
                  setDate(newRange) // Update main state immediately

                  // --- Start comparison logic ---
                  let matchedMonthLabel: string | null = null
                  const today = new Date()
                  const currentMonthRange = {
                    from: startOfMonth(today),
                    to: endOfMonth(today),
                  }

                  // Check against "Mes actual" first
                  if (
                    isSameDay(newRange.from, currentMonthRange.from) &&
                    isSameDay(newRange.to, currentMonthRange.to)
                  ) {
                    matchedMonthLabel = currentMonthLabel
                  } else {
                    // Check against other months in the list (excluding "Mes actual")
                    for (const monthLabel of months) {
                      if (monthLabel === currentMonthLabel) continue // Skip already checked

                      try {
                        // Ensure locale is dynamically imported for parsing
                        const localeModule = intl.locale
                          ? await import(`date-fns/locale/${intl.locale}`)
                          : undefined
                        const parsedDate = parse(
                          monthLabel,
                          "LLLL yyyy",
                          new Date(),
                          {
                            locale: localeModule?.default,
                          }
                        )
                        const monthRange = {
                          from: startOfMonth(parsedDate),
                          to: endOfMonth(parsedDate),
                        }

                        if (
                          isSameDay(newRange.from, monthRange.from) &&
                          isSameDay(newRange.to, monthRange.to)
                        ) {
                          matchedMonthLabel = monthLabel
                          break // Found a match, exit loop
                        }
                      } catch (error) {
                        console.error(
                          "Error parsing month for comparison:",
                          monthLabel,
                          error
                        )
                        // Continue checking other months even if one fails to parse
                      }
                    }
                  }

                  // Update selectedMonth based on whether a match was found
                  if (matchedMonthLabel) {
                    setSelectedMonth(matchedMonthLabel)
                  } else {
                    // Use intl for "Custom Period" if available, otherwise fallback to string
                    // Assuming "customPeriod" is the desired translation key
                    try {
                      setSelectedMonth(
                        intl.formatMessage({ id: "customPeriod" }) // Updated key
                      )
                    } catch (e) {
                      // Fallback if the translation key doesn't exist yet
                      setSelectedMonth("período personalizado") // Fallback string remains the same
                      console.warn(
                        "Translation key 'customPeriod' not found. Using fallback string." // Updated warning message
                      )
                    }
                  }
                  // --- End comparison logic ---

                  setIsCustomPopoverOpen(false) // Close popover
                }
              }}
            />
            <Button variant="default" className="w-full" type="submit">
              <FormattedMessage id="apply" />
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" size="icon" onClick={handleDownload}>
        <DownloadIcon size={16} />
      </Button>
    </div>
  )
}
