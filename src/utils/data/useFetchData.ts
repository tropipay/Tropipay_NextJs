import { buildGraphQLVariables, makeApiRequest } from "@/utils/api/utilsApi"
import { generateHashedKey } from "@/utils/data/utils"
import { getToken } from "@/utils/user/utilsUser"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { isProduction } from "../utils"

/**
 * A hook for fetching data from the API using TanStack Query.
 * @param {any} { queryConfig, dehydratedState, urlParams, enabled = true }
 * @returns {UseQueryResult<T>} The result of the query.
 */
export function useFetchData<T>({
  queryConfig,
  urlParams,
  enabled = true,
  debug = false
}: any): UseQueryResult<T> {
  const QueryKey = generateHashedKey(queryConfig.key, urlParams)
  const filters = queryConfig.filters
  const variables = buildGraphQLVariables(urlParams, filters)
  const token = getToken()

  return useQuery({
    queryKey: [QueryKey, variables],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
        token,
        debug
      }),
    staleTime: queryConfig.staleTime ?? 20 * 60 * 1000,
    enabled: !!token && enabled,
    retry: 2,
  })
}
