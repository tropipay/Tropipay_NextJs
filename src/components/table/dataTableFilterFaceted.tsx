import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"
import * as React from "react"

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
import useFiltersManager from "@/hooks/useFiltersManager"
import { cn } from "@/lib/utils"
import { PopoverClose } from "@radix-ui/react-popover"
import { FormattedMessage, useIntl } from "react-intl"
import { Checkbox } from "../ui/checkbox"

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
  placeHolder,
  options = [],
  apiUrl,
}: DataTableFilterFacetedProps<TData, TValue>) {
  const { formatMessage } = useIntl()
  const { initialSelected, values, setValues, onSubmit, setParam } =
    useFiltersManager({
      column,
    })

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

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkbox = event.currentTarget

    const order = values.indexOf(checkbox.value)
    checkbox.checked = !order
    if (order > -1) {
      values.splice(order, 1)
    } else {
      values.push(checkbox.value)
    }
    setValues([...values])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 h-8 border-dashed">
          {initialSelected?.length > 0 ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                setParam(column.id, null)
              }}
            >
              <MinusCircledIcon className="h-4 w-4" />
            </div>
          ) : (
            <PlusCircledIcon className="h-4 w-4" />
          )}
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
            <CommandInput
              placeholder={
                placeHolder ? formatMessage({ id: placeHolder }) : ""
              }
            />
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
                          checked={values.includes(option.value)}
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
                {<FormattedMessage id="apply" />}
              </Button>
            </PopoverClose>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
