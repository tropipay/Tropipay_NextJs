import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { urlParamsToFilter, urlParamsTyping } from "./utils"

export interface FetchOptions {
  queryConfig: FetchDataConfig
  token: string | undefined
  urlParams: any
}

export async function makeApiRequest({
  queryConfig,
  token,
  variables,
}: FetchOptions) {
  const headers = {
    ...queryConfig.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const body = {
    ...queryConfig.body,
    ...variables,
  }

  const response = await fetch(queryConfig.url, {
    method: queryConfig.method,
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message ||
        `Error fetching data: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

interface SearchParams {
  [key: string]: string // Parámetros de búsqueda dinámicos
  page?: string
  size?: string
  sort?: string
  order?: string
  search?: string
}

interface FilterConfig {
  type: "amount" | "list" | "date" | "uniqueValue"
  column: string
  label?: React.ReactNode
  options?: any[]
  placeHolder?: string
}

interface ColumnConfig {
  id: string
  filter?: FilterConfig
  accessorKey?: string
  header?: any
  cell?: any
  enableSorting?: boolean
  enableHiding?: boolean
}

interface Config {
  columns: ColumnConfig[]
}

interface GraphQLVariables {
  filter: {
    [key: string]: any // Filtros dinámicos
    generalSearch?: string
  }
  pagination: {
    limit: number
    offset: number
  }
  sort?: {
    field: string
    direction: string
  }
}

export function buildGraphQLVariables(
  searchParams: SearchParams,
  columns: any
): { variables: GraphQLVariables } {
  const { page, size, sort, order, search, ...filters } = searchParams
  const variables: GraphQLVariables = {
    filter: {},
    pagination: {
      limit: size ?? 50,
      offset: page ?? 0,
    },
  }

  // Procesar el campo de búsqueda general (search)
  if (search) {
    variables.filter.generalSearch = search
  }

  // Procesar los filtros adicionales
  columns.forEach((column) => {
    if (filters[column.column]) {
      const filterType = column.type
      const filterValue = filters[column.column]

      switch (filterType) {
        case "amount":
          const [amountFrom, amountTo] = filterValue.split(",")
          if (amountFrom)
            variables.filter[`${column.column}Gte`] = parseFloat(amountFrom)
          if (amountTo)
            variables.filter[`${column.column}Lte`] = parseFloat(amountTo)
          break

        case "list":
          variables.filter[column.column] = filterValue.split(",")
          break

        case "date":
          const [dateFrom, dateTo] = filterValue.split(",")
          if (dateFrom)
            variables.filter[`${column.column}From`] = new Date(
              dateFrom
            ).toISOString()
          if (dateTo)
            variables.filter[`${column.column}To`] = new Date(
              dateTo
            ).toISOString()
          break

        case "uniqueValue":
          variables.filter[column.column] = filterValue
          break

        default:
          break
      }
    }
  })

  // Dejar espacio para sort y order (a implementar en el futuro)
  if (sort || order) {
    variables.sort = {
      field: sort,
      direction: order ?? "asc",
    }
  }

  return { variables }
}
