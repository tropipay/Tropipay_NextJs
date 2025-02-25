import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { format, parse } from "date-fns"
import { fetchHeaders } from "./utils"

export interface FetchOptions {
  queryConfig: FetchDataConfig
  variables: { variables: GraphQLVariables }
  token?: string
}

export async function makeApiRequest({
  queryConfig: { url, method, body },
  variables,
  token,
}: FetchOptions) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${token}`,
    },
    ...(body && {
      body: JSON.stringify({
        ...body,
        ...variables,
      }),
    }),
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
  page?: string
  size?: string
  sort?: string
  order?: string
  search?: string

  [key: string]: string | undefined // Parámetros de búsqueda dinámicos
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
  console.log("-------- columns:", columns)
  const {
    page = "0",
    size = "50",
    sort,
    order,
    search,
    ...filters
  } = searchParams
  const variables: GraphQLVariables = {
    filter: {},
    pagination: {
      limit: parseInt(size),
      offset: parseInt(page),
    },
  }

  // Procesar el campo de búsqueda general (search)
  if (search) {
    variables.filter.generalSearch = search
  }

  const formatNumber = (textNumber: string) =>
    parseInt(parseFloat(textNumber).toFixed(2).replace(".", ""))

  // Procesar los filtros adicionales
  columns?.forEach((column: any) => {
    if (filters[column.column]) {
      const filterType = column.type
      const filterValue = filters[column.column]

      switch (filterType) {
        case "amount": {
          const [amountFrom, amountTo] = filterValue?.split(",") ?? []
          if (amountFrom) {
            variables.filter[`${column.column}Gte`] = formatNumber(amountFrom)
          }
          if (amountTo) {
            variables.filter[`${column.column}Lte`] = formatNumber(amountTo)
          }
          break
        }
        case "list":
          variables.filter[column.column] = filterValue?.split(",")
          break

        case "date":
          const [dateFrom, dateTo] = filterValue?.split(",") ?? []
          if (dateFrom) {
            const fecha = parse(dateFrom, "dd/MM/yyyy", new Date())
            const fechaISO = format(fecha, "yyyy-MM-dd")
            variables.filter[`${column.column}From`] = fechaISO
          }

          if (dateTo) {
            const fecha = parse(dateTo, "dd/MM/yyyy", new Date())
            const fechaISO = format(fecha, "yyyy-MM-dd")
            variables.filter[`${column.column}To`] = fechaISO
          }
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
    variables.filter = {
      ...variables.filter,
      orderBy: sort ?? "",
      orderDirection: order?.toUpperCase() ?? "ASC",
    }
  }

  return { variables }
}
