import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
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
  const { setParam } = useFilterParams()
  const facets = column?.getFacetedUniqueValues()

  const [fetchedOptions, setFetchedOptions] = React.useState<
    { label: string; value: string }[]
  >([])

  const selectedValues = new Set(column?.getFilterValue() as string[])

  React.useEffect(() => {
    console.log("apiUrl:", apiUrl)
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {label}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {"Selected"}
                  </Badge>
                ) : (
                  displayOptions
                    .filter((option) => selectedValues.has(option.value))
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
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>{"No Filter results"}</CommandEmpty>
            <CommandGroup>
              {displayOptions.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      /*                       column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
 */ setParam(thisColumn, filterValues)
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2">
          <Button variant="default" className="bg-blue-600 text-white w-full">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
