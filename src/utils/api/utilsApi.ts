import { FetchOptions } from "@/types/fetchData"
import { fetchHeaders, formatAmountToCents } from "@/utils/data/utils"
import { format, parse } from "date-fns"

/**
 * Makes an API request.
 * @param {FetchOptions} { queryConfig, variables, columnVisibility, token, debug }
 * @returns {Promise<any>} The response from the API.
 */
export async function makeApiRequest({
  queryConfig,
  variables,
  columnVisibility,
  token,
  debug = false,
}: FetchOptions) {
  const { url, method, body } = queryConfig
  let bodyUpdated = {}
  if (body) {
    const visibleColumns = Object.keys(queryConfig.columnsDef).filter(
      (key) => !queryConfig.columnsDef[key].hidden
    )

    const activeColumns: string[] =
      Object.keys(columnVisibility).length > 0
        ? Object.keys(columnVisibility).filter((key) => columnVisibility[key])
        : visibleColumns

    const fields = generateQueryFields(queryConfig.columnsDef, activeColumns)

    bodyUpdated = {
      ...{
        ...() => {
          const { query, variables, ...rest } = body
          return rest
        },
        query: body.query.replace("$FIELDS", fields),
      },
      ...variables,
    }
  }

  if (debug) {
    console.log("url: ", url)
    body && console.log("body: ", JSON.stringify(bodyUpdated, null, 2))
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${token}`,
    },
    ...(body && {
      body: JSON.stringify(bodyUpdated),
    }),
    cache: "no-store",
  })
  // console.log("response:", await response.json())

  if (!response.ok) throw new Error(response.statusText)

  return response.json()
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

  // Process additional filters
  columns?.forEach((column: any) => {
    if (filters[column.id]) {
      const filterType = column.filterType
      const filterValue = filters[column.id]

      switch (filterType) {
        case "amount": {
          const [amountGte, amountLte] = filterValue?.split(",") ?? []
          if (amountGte) {
            variables.filter[`${column.id}Gte`] = formatAmountToCents(amountGte)
          }
          if (amountLte) {
            variables.filter[`${column.id}Lte`] = formatAmountToCents(amountLte)
          }
          break
        }

        case "list":
          variables.filter[column.id] = filterValue?.split(",") ?? []
          break

        case "date":
          const [dateFrom, dateTo] = filterValue?.split(",") ?? []
          if (dateFrom) {
            const dateFromParsed = parse(dateFrom, "dd/MM/yyyy", new Date())
            const dateFromISO = format(dateFromParsed, "yyyy-MM-dd")
            variables.filter[`${column.id}From`] = dateFromISO
          }

          if (dateTo) {
            const dateToParsed = parse(dateTo, "dd/MM/yyyy", new Date())
            const dateToISO = format(dateToParsed, "yyyy-MM-dd")
            variables.filter[`${column.id}To`] = dateToISO
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
