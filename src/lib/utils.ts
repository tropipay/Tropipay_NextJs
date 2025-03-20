import { QueryKey } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUser } from "./utilsUser"
import { createHash } from "crypto"

// Definimos un tipo para una función de búsqueda que toma un parámetro `T` y devuelve un endpoint
type FetchFunction<T extends any[]> = (...args: T) => { endpoint: string }

// Tipo de configuración para `useQuery`
type QueryConfig<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  initialData?: TData
  staleTime?: number
}

// Función para combinar clases (cn)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Función para construir parámetros de consulta (queryParams)
const queryParams = (
  params: Record<string, string | number | boolean>
): string => {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

// Tipos para fetchGetData y headerData
interface FetchGetData {
  endpoint: string
  isPublic?: boolean
  filter?: Record<string, string | number | boolean>
}

interface HeaderData {
  [key: string]: string
}

export const fetchHeaders: Record<string, string> = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

export function generateHashedKey(key: string, obj: any): string {
  const sortedObj = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {} as Record<string, any>)
  const str = JSON.stringify(sortedObj)
  return `${key} | ${btoa(str)}`
}

export async function processQueryParameters(
  searchParams: Record<string, string>
) {
  try {
    const resolvedParams = await searchParams
    return resolvedParams
  } catch (error) {
    console.error("Error processing query parameters:", error)
    return {}
  }
}

export function selStyle(
  condition: boolean,
  classesTrue: string,
  classesFalse: string,
  commonStyle: string
): string {
  return condition ? classesTrue : classesFalse
}

export const formatAmount = (
  amount: number,
  currency: string = "",
  position: "left" | "right" = "left"
): string => {
  let formatter = ""

  if (currency === "") {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    }).format(amount / 100)
  } else {
    formatter =
      position !== "left"
        ? `${(amount / 100).toFixed(2)} ${currency}`
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
          }).format(amount / 100)
  }

  return formatter
}

export const truncateLabels = (
  options: string[],
  maxLength: number = 20
): string => {
  const concatenated = options.map((option) => option).join(", ")

  if (concatenated.length <= maxLength) {
    return concatenated
  }

  return concatenated.substring(0, maxLength - 3) + "..."
}

/* ---------------------------- */

export const setFilterType = (filter: any, type: any): string | null => {
  const filterTypeResult = {
    simpleText: "uniqueValue",
    faceted: "list",
    date: "date",
    amount: "amount",
    facetedBadge: "list",
    free: "uniqueValue",
    select: null,
  }
  return filterTypeResult[type]
}

export function setFilters<TData>(
  // @ts-ignore
  columnsConfig: Record<string, ColumnOptions<TData>>
): ColumnDef<TData>[] {
  return Object.entries(columnsConfig).map(([id, options]) => {
    const {
      type,
      title,
      enableSorting = true,
      enableHiding = true,
      filter = true,
      filterType = setFilterType(filter, type),
      filterLabel = title || id,
      filterPlaceholder = title || id,
      showFilter = false,
      hidden = false,
    } = options

    const baseConfig: any = {
      id,
      accessorKey: id,
      enableSorting,
      enableHiding,
      filterType,
      filterLabel,
      filterPlaceholder,
      filter,
      showFilter,
      hidden,
    }

    return baseConfig
  })
}

export function objToHash(obj) {
  const keys = Object.keys(obj)
    .filter((key) => obj[key] === true)
    .sort()
    .join(",")

  return createHash("sha256").update(keys).digest("hex")
}

export function toArrayId(
  arr: ColumnConfig[],
  propertyName: string,
  value: any | ((itemValue: any) => boolean),
  sortBy: string | null = null
): string[] {
  // Crear una copia del array para no modificar el original
  const processedArray: ColumnConfig[] = [...arr]

  // Ordenar el array si se especifica un campo para ordenar
  if (sortBy) {
    processedArray.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1
      if (a[sortBy] > b[sortBy]) return 1
      return 0
    })
  }

  // Filtrar el array según la condición
  const filteredArray = processedArray.filter((item) => {
    if (typeof value === "function") {
      return value(item[propertyName])
    } else {
      return item[propertyName] === value
    }
  })

  // Extraer solo los 'id' de los objetos filtrados
  return filteredArray.map((item) => item.id)
}

type ColumnConfig = {
  id: string
  [key: string]: any // Permite otras propiedades dinámicas
}

export function toActiveObject(
  arr: ColumnConfig[],
  propertyName: string,
  value: any | ((itemValue: any) => boolean),
  sortBy: string | null = null
): Record<string, boolean> {
  // Crear una copia del array para no modificar el original
  const processedArray: ColumnConfig[] = [...arr]

  // Ordenar el array si se especifica un campo para ordenar
  if (sortBy) {
    processedArray.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1
      if (a[sortBy] > b[sortBy]) return 1
      return 0
    })
  }

  // Crear un objeto con los id como claves y valores booleanos basados en la condición
  const result: Record<string, boolean> = {}
  processedArray.forEach((item) => {
    if (typeof value === "function") {
      result[item.id] = value(item[propertyName])
    } else {
      result[item.id] = item[propertyName] === value
    }
  })

  return result
}

export const getRowValue = (value: string) => (!!value ? value : "-")

/**
 * Check if the token expires.
 * @param token token.
 */
export const isTokenExpired = (token: string) => {
  const decodedJwt = JSON.parse(atob(token.split(".")[1]))
  return decodedJwt.exp * 1000 < Date.now()
}
