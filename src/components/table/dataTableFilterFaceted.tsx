"use client"

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
import { cn, truncateLabels } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import { CheckIcon } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface DataTableFilterFacetedProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableFilterFaceted<TData, TValue>({
  column,
}: DataTableFilterFacetedProps<TData, TValue>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fetchedOptions, setFetchedOptions] = React.useState<
    { label: string; value: string }[]
  >([])
  const { label, options, apiUrl, placeHolder } =
    (column as any)?.config.filter ?? {}

  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined
    return new Set(filterValue?.split(",") || [])
  }, [column?.getFilterValue()])

  const [localSelectedValues, setLocalSelectedValues] =
    React.useState<Set<string>>(selectedValues)

  const facets = column?.getFacetedUniqueValues()
  const title = column?.config.filter.label

  const handleSelectOption = (value: string) => {
    const newSelectedValues = new Set(localSelectedValues)
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value)
    } else {
      newSelectedValues.add(value)
    }
    setLocalSelectedValues(newSelectedValues)
  }

  const handleApplyFilters = () => {
    const filterValues = Array.from(localSelectedValues)
    const serializedValue = filterValues.join(",")
    column?.setFilterValue(
      filterValues.length > 0 ? serializedValue : undefined
    )
  }

  const handleClearFilters = () => {
    setLocalSelectedValues(new Set())
    column?.setFilterValue(undefined)

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete(column?.id || "")
  }

  React.useEffect(() => {
    const statusParam = searchParams.get(column?.id || "")
    const searchParamsValues = statusParam
      ? new Set(statusParam.split(","))
      : new Set<string>()
    setLocalSelectedValues(searchParamsValues)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selectedValues.size > 0 ? "active" : "inactive"}
          size="sm"
          className="px-2 h-8"
        >
          {label}

          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              <div className="space-x-1 lg:flex">
                {truncateLabels(
                  Array.from(selectedValues).map(
                    (value) =>
                      options.find((option: any) => option.value === value)
                        ?.label || value
                  )
                )}
              </div>
            </>
          )}
          {selectedValues.size > 0 ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                handleClearFilters()
              }}
            >
              <CrossCircledIcon className="h-4 w-4" />
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{"No Filter results"}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = localSelectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectOption(option.value)}
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
                    {/* {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
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
            <div className="p-2">
              <PopoverClose asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 text-white w-full"
                  type="submit"
                  onClick={handleApplyFilters}
                >
                  {<FormattedMessage id="apply" />}
                </Button>
              </PopoverClose>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
