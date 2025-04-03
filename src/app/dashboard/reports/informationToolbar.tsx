import { Button } from "@/components/ui/button"
import { CalendarIcon, CheckIcon, DownloadIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState, useRef } from "react" // Añadido useRef
import { DateRange } from "react-day-picker"
import { format, subMonths, addDays } from "date-fns"
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7), // Ejemplo: rango inicial de 7 días
  })
  const [selectedMonth, setSelectedMonth] = useState("Mes actual")
  const longPressTimer = useRef<NodeJS.Timeout | null>(null) // Ref para el temporizador

  const months = [
    "Mes actual",
    ...Array.from({ length: 24 }, (_, i) =>
      format(subMonths(new Date(), i), "MMMM yyyy")
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
              <CalendarIcon size={16} />{" "}
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
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
