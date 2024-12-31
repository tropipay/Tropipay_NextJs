import * as React from "react"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import useFilterParams from "@/hooks/useFilterParams"
import { Checkbox } from "../ui/checkbox"
import { PopoverClose } from "@radix-ui/react-popover"

interface DataTableFilterFacetedProps<TData, TValue> {
  column?: Column<TData, TValue>
  label?: string
  options?: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  apiUrl?: string
}

export function DataTableFilterFaceted<TData, TValue>({
  column,
  label,
  options = [],
  apiUrl,
}: DataTableFilterFacetedProps<TData, TValue>) {
  const thisColumn = column?.id || ""
  const { setParam, getParam } = useFilterParams()
  const initialSelected = getParam(thisColumn) || []
  const [selected, setSelected] = React.useState(initialSelected || [])
  const [fetchedOptions, setFetchedOptions] = React.useState<
    { label: string; value: string }[]
  >([])

  React.useEffect(() => {
    if ((!options || options.length === 0) && apiUrl) {
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const mappedOptions = data.map((item: any) => ({
            label: item.name || item.label || "Unnamed",
            value: item.id || item.value || "",
            icon: null,
          }))
          setFetchedOptions(mappedOptions)
        })
        .catch((err) => console.error("Error fetching data:", err))
    }
  }, [apiUrl])

  const displayOptions = options.length > 0 ? options : fetchedOptions

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setParam(thisColumn, selected)
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget

    const order = selected.indexOf(checkbox.value)
    checkbox.checked = !order

    if (order > -1) {
      selected.splice(order, 1)
    } else {
      selected.push(checkbox.value)
    }
    setSelected([...selected])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {label}
          {initialSelected?.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {initialSelected?.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {initialSelected?.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {initialSelected?.length} {"Selected"}
                  </Badge>
                ) : (
                  displayOptions
                    .filter((option) => initialSelected.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <form onSubmit={onSubmit}>
          <Command>
            <CommandInput placeholder={label} />
            <CommandList>
              <CommandEmpty>{"No Filter results"}</CommandEmpty>
              <CommandGroup>
                {displayOptions.map((option) => {
                  return (
                    <CommandItem key={option.value}>
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary"
                        )}
                      >
                        <Checkbox
                          name="options"
                          value={option.value}
                          onClick={handleCheckboxClick}
                          checked={selected.includes(option.value)}
                        />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="p-2">
            <PopoverClose asChild>
              <Button
                variant="default"
                className="bg-blue-600 text-white w-full"
                type="submit"
              >
                Aplicar
              </Button>
            </PopoverClose>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
