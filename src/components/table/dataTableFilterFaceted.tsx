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

  // Obtener los valores seleccionados directamente de la columna usando TanStack Table
  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue() as string[] | undefined
    return new Set(filterValue || [])
  }, [column?.getFilterValue()])

  // Estado local para manejar los valores seleccionados temporalmente (solo para la UI del Popover)
  const [localSelectedValues, setLocalSelectedValues] =
    React.useState<Set<string>>(selectedValues)

  // Cargar opciones desde la API si es necesario
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
  }, [apiUrl, options])

  // Obtener los valores únicos de la columna para mostrar conteos
  const facets = column?.getFacetedUniqueValues()
  const title = column?.config.filter.label

  // Función para manejar la selección/deselección de opciones
  const handleSelectOption = (value: string) => {
    const newSelectedValues = new Set(localSelectedValues)
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value)
    } else {
      newSelectedValues.add(value)
    }
    setLocalSelectedValues(newSelectedValues)
  }

  // Función para aplicar los filtros cuando se hace clic en "Aplicar"
  const handleApplyFilters = () => {
    const filterValues = Array.from(localSelectedValues)
    column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined)

    // Actualizar la URL con los nuevos filtros
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (filterValues.length > 0) {
      newSearchParams.set(column?.id || "", filterValues.join(","))
    } else {
      newSearchParams.delete(column?.id || "")
    }
    router.push(`?${newSearchParams.toString()}`, { scroll: false }) // Evitar scroll al actualizar la URL
  }

  // Función para limpiar los filtros
  const handleClearFilters = () => {
    setLocalSelectedValues(new Set())
    column?.setFilterValue(undefined)

    // Limpiar los filtros de la URL
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete(column?.id || "")
    router.push(`?${newSearchParams.toString()}`, { scroll: false }) // Evitar scroll al actualizar la URL
  }

  // Efecto para inicializar el estado local con los valores de los searchParams al montar el componente
  React.useEffect(() => {
    const statusParam = searchParams.get(column?.id || "")
    const searchParamsValues = statusParam
      ? new Set(statusParam.split(","))
      : new Set<string>()
    setLocalSelectedValues(searchParamsValues)
  }, []) // Solo se ejecuta al montar el componente

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
