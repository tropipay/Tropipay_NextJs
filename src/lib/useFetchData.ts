import { Query, useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"

export function useFetchData<T>({
  queryConfig,
  dehydratedState,
  urlParams,
}: any): UseQueryResult<T> {
  const { data: session } = useSession()
  const token = session?.user?.access_token
  const QueryKey = generateHashedKey(queryConfig.key, urlParams)
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)

  return useQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        token,
        variables,
      }),
    initialData: dehydratedState.queries?.find(
      (query: Query) =>
        JSON.stringify(query.queryKey) === JSON.stringify([QueryKey])
    )?.state?.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  })
}
