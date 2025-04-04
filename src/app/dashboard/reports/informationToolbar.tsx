import { Button } from "@/components/ui/button"
import { CalendarIcon, CheckIcon, DownloadIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState, useRef } from "react" // Añadido useRef
import { useIntl } from "react-intl" // Import useIntl
import { DateRange } from "react-day-picker"
import { subMonths, addDays } from "date-fns" // Removed format
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7), // Ejemplo: rango inicial de 7 días
  })
  // Use translation for initial state
  const [selectedMonth, setSelectedMonth] = useState(
    intl.formatMessage({ id: "reports.currentMonth" })
  )
  const longPressTimer = useRef<NodeJS.Timeout | null>(null) // Ref para el temporizador

  // Use translation and intl.formatDate for month list
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>{selectedMonth}</span> {/* Mostrar mes seleccionado */}
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
                        // Aquí podrías cerrar el Popover si es necesario
                      }}
                      className="cursor-pointer" // Añadido para indicar que es clickeable
                    >
                      {selectedMonth === month && (
                        <CheckIcon className="mr-2 h-4 w-4" />
                      )}{" "}
                      {/* Opcional: Muestra un check si está seleccionado */}
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
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              {date?.from ? (
                date.to ? (
                  // Use intl.formatDate for date range display
                  <>
                    {intl.formatDate(date.from, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {intl.formatDate(date.to, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </>
                ) : (
                  // Use intl.formatDate for single date display
                  intl.formatDate(date.from, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
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
