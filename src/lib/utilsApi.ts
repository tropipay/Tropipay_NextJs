import { format, parse } from "date-fns"
import { fetchHeaders } from "./utils"

export interface FetchOptions {
  queryConfig: FetchDataConfig
  variables: { variables: GraphQLVariables }
  token?: string
  columnVisibility: any
}

/**
 * Makes an API request.
 * @param {FetchOptions} { queryConfig, variables, token, columnVisibility }
 * @returns {Promise<any>} The response from the API.
 */
export async function makeApiRequest({
  queryConfig,
  variables,
  token,
  columnVisibility,
}: FetchOptions) {
  const visibleColumns = Object.keys(queryConfig.columnsDef).filter(
    (key) => !queryConfig.columnsDef[key].hidden
  )

  const activeColumns: string[] =
    Object.keys(columnVisibility).length > 0
      ? Object.keys(columnVisibility).filter((key) => columnVisibility[key])
      : visibleColumns

  const fields = generateQueryFields(queryConfig.columnsDef, activeColumns)

  const { url, method, body } = queryConfig
  /* console.log("body:", {
    ...{
      body,
      query: body.query.replace("$FIELDS", fields),
    },
    ...variables,
  }.body) 
  console.log(
    "variables:",
    {
      ...{
        body,
        query: body.query.replace("$FIELDS", fields),
      },
      ...variables,
    }.variables
  )*/

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${token}`,
    },
    ...(body && {
      body: JSON.stringify({
        ...{
          body,
          query: body.query.replace("$FIELDS", fields),
        },
        ...variables,
      }),
    }),
    cache: "no-store",
  })
  // console.log("response:", await response.json())

  if (!response.ok) throw new Error(response.statusText)

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
      offset: parseInt(page) * parseInt(size),
    },
  }

  // Process the general search field (search)
  if (search) {
    variables.filter.generalSearch = search
  }

  const formatNumber = (textNumber: string) =>
    parseInt(parseFloat(textNumber).toFixed(2).replace(".", ""))

  // Process additional filters
  columns?.forEach((column: any) => {
    if (filters[column.id]) {
      const filterType = column.filterType
      const filterValue = filters[column.id]

      switch (filterType) {
        case "amount": {
          const [amountFrom, amountTo] = filterValue?.split(",") ?? []
          if (amountFrom) {
            variables.filter[`${column.id}Gte`] = formatNumber(amountFrom)
          }
          if (amountTo) {
            variables.filter[`${column.id}Lte`] = formatNumber(amountTo)
          }
          break
        }
        case "list":
          variables.filter[column.id] = filterValue?.split(",")
          break

        case "date":
          const [dateFrom, dateTo] = filterValue?.split(",") ?? []
          if (dateFrom) {
            const fecha = parse(dateFrom, "dd/MM/yyyy", new Date())
            const fechaISO = format(fecha, "yyyy-MM-dd")
            variables.filter[`${column.id}From`] = fechaISO
          }

          if (dateTo) {
            const fecha = parse(dateTo, "dd/MM/yyyy", new Date())
            const fechaISO = format(fecha, "yyyy-MM-dd")
            variables.filter[`${column.id}To`] = fechaISO
          }
          break

        case "uniqueValue":
          variables.filter[column.id] = filterValue
          break

        default:
          break
      }
    }
  })

  // Leave room for sort and order (to be implemented in the future)
  if (sort || order) {
    variables.filter = {
      ...variables.filter,
      orderBy: sort ?? "",
      orderDirection: order?.toUpperCase() ?? "ASC",
    }
  }

  return { variables }
}

export const generateQueryFields = (
  columns: Record<string, any>,
  activeColumns: string[]
): string => {
  return activeColumns
    .map((columnKey) => {
      const column = columns[columnKey]
      return column.field ?? columnKey
    })
    .filter(Boolean) // Filter null values
    .join("\n") // Join fields with a line break
}
