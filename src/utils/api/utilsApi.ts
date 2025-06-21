import { env } from "@/config/env"
import ProfileStore from "@/stores/ProfileStore"
import { GraphQLVariables, SearchParams } from "@/types/api"
import { FetchOptions } from "@/types/fetchData"
import { fetchHeaders, formatAmountToCents } from "@/utils/data/utils"
import { parse } from "date-fns"
import getConfig from "next/config"
import { getUserSettings } from "../user/utilsUser"
import axiosApi from "./axiosApi"

/**
 * Makes an API request.
 * @param {FetchOptions} options - Configuration options for the API request.
 * @param {object} options.queryConfig - The query configuration.
 * @param {object} options.variables - The variables for the query.
 * @param {string} options.token - The authentication token.
 * @param {boolean} options.debug - Whether to enable debug logging.
 * @returns {Promise<any>} The response from the API.
 */
export async function makeApiRequest({
  queryConfig,
  variables,
  token,
  debug = false,
}: FetchOptions) {
  const { url, method, body } = queryConfig
  const apiUrl = getConfig()?.publicRuntimeConfig?.API_URL || env.API_URL

  const columnVisibility = getUserSettings(
    (ProfileStore?.getProfileData() as any)?.id,
    {},
    queryConfig.key,
    "columnVisibility"
  )

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
    console.log("url: ", `${apiUrl}${url}`)
    body && console.log("body: ", JSON.stringify(bodyUpdated, null, 2))
  }

  try {
    const response = await axiosApi({
      url: `${env.API_URL}${url}`,
      method,
      headers: {
        ...fetchHeaders,
        Authorization: `Bearer ${token}`,
      },
      ...(body && {
        data: JSON.stringify(bodyUpdated),
      }),
      validateStatus: (status) => status >= 200 && status < 300,
    })

    if (debug) {
      console.log("data:", response.data)
    }

    return response.data
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Builds GraphQL variables based on search parameters and column definitions.
 * @param {SearchParams} searchParams - The search parameters.
 * @param {any} columns - The column definitions.
 * @returns {{ variables: GraphQLVariables }} The GraphQL variables.
 */
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
    filter: { search },
    pagination: {
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
    },
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
            const dateFromParsed = new Date(
              Date.UTC(
                new Date(
                  parse(dateFrom, "dd/MM/yyyy", new Date())
                ).getFullYear(),
                new Date(parse(dateFrom, "dd/MM/yyyy", new Date())).getMonth(),
                new Date(parse(dateFrom, "dd/MM/yyyy", new Date())).getDate(),
                0,
                0,
                0
              )
            )
            variables.filter[`${column.id}From`] = dateFromParsed.toISOString()
          }

          if (dateTo) {
            const dateToParsed = new Date(
              Date.UTC(
                new Date(parse(dateTo, "dd/MM/yyyy", new Date())).getFullYear(),
                new Date(parse(dateTo, "dd/MM/yyyy", new Date())).getMonth(),
                new Date(parse(dateTo, "dd/MM/yyyy", new Date())).getDate(),
                23,
                59,
                59
              )
            )
            variables.filter[`${column.id}To`] = dateToParsed.toISOString()
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

/**
 * Generates a string of query fields based on active columns.
 * @param {Record<string, any>} columns - The column definitions.
 * @param {string[]} activeColumns - The active columns.
 * @returns {string} The generated query fields.
 */
export const generateQueryFields = (
  columns: Record<string, any>,
  activeColumns: string[]
): string =>
  activeColumns
    .map((columnKey) => {
      const column = columns[columnKey]
      return column.field ?? columnKey
    })
    .filter(Boolean) // Filter null values
    .join("\n") // Join fields with a line break
