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
import { useIntl } from "react-intl" // Import useIntl
import { DateRange } from "react-day-picker"
import { subMonths, addDays } from "date-fns"
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

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7), // Ejemplo: rango inicial de 7 días
  })

  const [selectedMonth, setSelectedMonth] = useState(
    intl.formatMessage({ id: "reports.currentMonth" })
  )
  const [isMonthPopoverOpen, setIsMonthPopoverOpen] = useState(false) // Estado para el popover de mes
  const longPressTimer = useRef<NodeJS.Timeout | null>(null) // Ref para el temporizador

  const months = [
    intl.formatMessage({ id: "reports.currentMonth" }),
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
                      onSelect={() => {
                        setSelectedMonth(month)
                        setIsMonthPopoverOpen(false)
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
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
                <span>{intl.formatMessage({ id: "reports.pickDate" })}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" size="icon" onClick={handleDownload}>
        <DownloadIcon size={16} />
      </Button>
    </div>
  )
}
