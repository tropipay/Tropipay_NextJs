import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"
import { getUserSettings } from "./utilsUser"

export function useFetchData<T>({
  queryConfig,
  dehydratedState,
  urlParams,
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
    enabled: !!token,
  })
}
