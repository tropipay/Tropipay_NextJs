import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { generateHashedKey } from "@/utils/data/utils"
import { buildGraphQLVariables, makeApiRequest } from "@/utils/api/utilsApi"
import { getUserSettings } from "@/utils/user/utilsUser"

/**
 * A hook for fetching data from the API using TanStack Query.
 * @param {any} { queryConfig, dehydratedState, urlParams, enabled = true }
 * @returns {UseQueryResult<T>} The result of the query.
 */
export function useFetchData<T>({
  queryConfig,
  dehydratedState,
  urlParams,
  enabled = true,
}: any): UseQueryResult<T> {
  const QueryKey = generateHashedKey(queryConfig.key, urlParams)
  const filters = queryConfig.filters
  const variables = buildGraphQLVariables(urlParams, filters)
  const { data: session } = useSession()
  const { token, id: userId } = session?.user || []
  const columnVisibility = getUserSettings(
    userId,
    {},
    queryConfig.key,
    "columnVisibility"
  )

  return useQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
        token,
        columnVisibility,
      }),
    initialData: dehydratedState?.queries.find(
      (q: any) => q.queryKey[0][0] === QueryKey
    )?.state?.data,
    staleTime: queryConfig.staleTime ?? 20 * 60 * 1000,
    enabled: !!token && enabled,
  })
}
