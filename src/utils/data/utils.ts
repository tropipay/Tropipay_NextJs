import { LANG_DEFAULT } from "@/components/intl/utils"
import { ColumnDef } from "@tanstack/react-table"
import { clsx, type ClassValue } from "clsx"
import { createHash } from "crypto"
import { isBefore, startOfDay } from "date-fns"
import { twMerge } from "tailwind-merge"
import { getUser } from "../user/utilsUser"

/**
 * Function to combine classes (cn).
 * @param inputs ClassValue[]
 * @returns string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Function to build query parameters (queryParams).
 * @param params Record<string, string | number | boolean> query parameters.
 * @returns string
 */
const queryParams = (
  params: Record<string, string | number | boolean>
): string => {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

/**
 * Types for fetchGetData and headerData.
 */
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

/**
 * Function to make a fetch GET with triggers.
 * @param {endpoint, isPublic, filter} FetchGetData
 * @param headerData HeaderData
 * @returns Promise<any>
 */
export const fetchGetWithTriggers = async (
  { endpoint, isPublic, filter }: FetchGetData,
  headerData: HeaderData = {}
): Promise<any> => {
  try {
    // Intenta obtener el usuario; en el servidor puede no estar disponible
    let user: UserSession
    try {
      user = await getUser()
    } catch (error) {
      console.warn("No se pudo obtener el usuario en el servidor:", error)
      user = {} // Default vacío si no se puede obtener en el servidor
    }

    const headers: Record<string, string> = {
      ...fetchHeaders,
      "Accept-Language": user?.lang || "en",
    }

    for (const key in headerData) {
      headers[key] = headerData[key]
    }

    if (!isPublic) {
      headers.Authorization = `Bearer ${user?.token || ""}`
    }

    if (filter) {
      endpoint += `?${queryParams(filter)}`
    }

    const deviceId = "010101" // Simulado, reemplazar con fingerprint si es necesario

    const response = await fetch(endpoint, {
      headers: { ...headers, "X-DEVICE-ID": deviceId },
    })

    if (!response.ok) throw new Error(response.statusText)

    return response.json()
  } catch (err) {
    throw err
  }
}

/**
 * Generates a hashed key from a string and an object.
 * @param key string
 * @param obj any
 * @returns string
 */
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

/**
 * Processes query parameters.
 * @param searchParams Record<string, string>
 * @returns Promise<Record<string, string>>
 */
export async function processQueryParameters(
  searchParams: Record<string, string>
) {
  try {
    return await searchParams
  } catch (error) {
    console.error("Error processing query parameters:", error)
    return {}
  }
}

/**
 * Converts search parameters to an object.
 * @param searchParams URLSearchParams
 * @returns {[key: string]: string | string[]}
 */
export function searchParamsToObject(searchParams: URLSearchParams): {
  [key: string]: string | string[]
} {
  const obj: { [key: string]: string | string[] } = {}
  searchParams.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        ;(obj[key] as string[]).push(value)
      } else {
        obj[key] = [obj[key] as string, value]
      }
    } else {
      obj[key] = value
    }
  })
  return obj
}

export function getUrlSearchData(data: any): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) {
          params.append(key, String(item))
        }
      }
    } else if (typeof value === "object") {
      params.append(key, JSON.stringify(value))
    } else {
      params.append(key, String(value))
    }
  }

  return params
}

/**
 * Selects a style based on a condition.
 * @param condition boolean
 * @param classesTrue string
 * @param classesFalse string
 * @param commonStyle string
 * @returns string
 */
export function selStyle(
  condition: boolean,
  classesTrue: string,
  classesFalse: string,
  commonStyle: string
): string {
  return condition ? classesTrue : classesFalse
}

/**
 * Formats an amount.
 * @param amount number
 * @param currency string
 * @param position "left" | "right"
 * @returns string
 */
export const formatAmount = (
  amount: number,
  currency: string = "",
  position: "left" | "right" = "left"
): string => {
  let formatter = ""

  if (currency === "") {
    formatter = new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
    }).format(amount / 100)
  } else {
    formatter =
      position !== "left"
        ? `${(amount / 100).toFixed(2)} ${currency}`
        : new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
          }).format(amount / 100)
  }

  return formatter
}

/**
 * Formats an amount to cents.
 *
 * @param textNumber The amount to format as a string.
 * @returns The amount in cents as an integer.
 */
export const formatAmountToCents = (textNumber: string) =>
  parseInt(parseFloat(textNumber).toFixed(2).replace(".", ""))

/**
 * Truncates labels.
 * @param options string[]
 * @param maxLength number
 * @returns string
 */
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

/**
 * Sets the filter type.
 * @param type any
 * @returns string | null
 */
export const setFilterType = (type = "simpleText"): string | null => {
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

/**
 * Sets filters.
 * @param columnsConfig Record<string, ColumnOptions<TData>>
 * @returns ColumnDef<TData>[]
 */
export function setFilters<TData>(
  // @ts-expect-error
  columnsConfig: Record<string, ColumnOptions<TData>>
): ColumnDef<TData>[] {
  return Object.entries(columnsConfig).map(([id, options]) => {
    const {
      type,
      title,
      enableSorting = true,
      enableHiding = true,
      filter = true,
      filterType = setFilterType(type),
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

/**
 * Converts an object to a hash.
 * @param obj any
 * @returns any
 */
export function objToHash(obj) {
  const keys = Object.keys(obj)
    .filter((key) => obj[key] === true)
    .sort()
    .join(",")

  return createHash("sha256").update(keys).digest("hex")
}

/**
 * Converts an array to an array of IDs.
 * @param arr ColumnConfig[]
 * @param propertyName string
 * @param value any | ((itemValue: any) => boolean)
 * @param sortBy string | null
 * @returns string[]
 */
export function toArrayId(
  arr: ColumnConfig[],
  propertyName: string,
  value: any | ((itemValue: any) => boolean),
  sortBy: string | null = null
): string[] {
  // Create a copy of the array to avoid modifying the original
  const processedArray: ColumnConfig[] = [...arr]

  // Sort the array if a field to sort is specified
  if (sortBy) {
    processedArray.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1
      if (a[sortBy] > b[sortBy]) return 1
      return 0
    })
  }

  // Filter the array based on the condition
  const filteredArray = processedArray.filter((item) => {
    if (typeof value === "function") {
      return value(item[propertyName])
    } else {
      return item[propertyName] === value
    }
  })

  // Extract only the 'id's' from the filtered objects
  return filteredArray.map((item) => item.id)
}

type ColumnConfig = {
  id: string
  [key: string]: any // Permite otras propiedades dinámicas
}

/**
 * Converts an array to an active object.
 * @param arr ColumnConfig[]
 * @param propertyName string
 * @param value any | ((itemValue: any) => boolean)
 * @param sortBy string | null
 * @returns Record<string, boolean>
 */
export function toActiveObject(
  arr: ColumnConfig[],
  propertyName: string,
  value: any | ((itemValue: any) => boolean),
  sortBy: string | null = null
): Record<string, boolean> {
  // Create a copy of the array to avoid modifying the original
  const processedArray: ColumnConfig[] = [...arr]

  // Sort the array if a sort field is specified
  if (sortBy) {
    processedArray.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1
      if (a[sortBy] > b[sortBy]) return 1
      return 0
    })
  }

  // Create an object with the IDs as keys and boolean values ​​based on the condition
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

/**
 * Gets the row value.
 * @param value string
 * @returns string
 */
export const getRowValue = (value: string) => (!!value ? value : "-")

/**
 * Check if the token expires.
 * @param token authentication token.
 */
export const isTokenExpired = (token: string) => {
  if (!token) return true
  try {
    const decodedJwt = JSON.parse(atob(token.split(".")[1]))
    return decodedJwt.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

export const getDatePeriods = (
  monthsBefore: number,
  t?: (_: string) => string,
  lang = LANG_DEFAULT
): DatePeriod[] => {
  if (monthsBefore < 0) throw new Error("El número de meses debe ser positivo")

  const periods: DatePeriod[] = []
  const currentDate = new Date()
  const referenceDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const startDate = startOfDay(new Date(2025, 0, 1))

  for (let i = 0; i <= monthsBefore; i++) {
    const targetDate = new Date(referenceDate)
    targetDate.setMonth(referenceDate.getMonth() - i)
    if (isBefore(targetDate, startDate)) continue

    const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
    const end = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)

    const monthName = new Intl.DateTimeFormat(lang, { month: "long" })
      .format(targetDate)
      .replace(/^\w/, (c) => c.toUpperCase())

    periods.push({
      label:
        i === 0
          ? t?.("currentMonth") ?? ""
          : `${monthName} ${t?.("of")} ${targetDate.getFullYear()}`,
      from: start,
      to: end,
    })
  }

  return periods
}

interface ErrorGeneratorParams {
  setErrorData: (errorData: {
    response: {
      type: string
      code: string
      message: string
      details: any[]
      i18n: string
    }
    type: string
  }) => void
  condition: boolean
  message: string
  type?: string
}

export const errorGenerator = ({
  setErrorData,
  condition,
  message,
  type = "error",
}: ErrorGeneratorParams): boolean => {
  if (condition) {
    setErrorData({
      response: {
        type: "VALIDATION_ERROR",
        code: "INVALID_CODE",
        message: "Invalid code",
        details: [],
        i18n: message,
      },
      type,
    })
    return true
  }
  return false
}
