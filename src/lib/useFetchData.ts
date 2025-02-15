import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"

export function useFetchData<T>({
  queryConfig,
  dehydratedState,
  urlParams,
}: any): UseQueryResult<T> {
  const QueryKey = generateHashedKey(queryConfig.key, urlParams)
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)

  const { data: session } = useSession()
  const token = session?.user.token

  return useQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
        token,
      }),
    initialData: dehydratedState?.queries.find(
      (q: any) => q.queryKey[0][0] === QueryKey
    )?.state?.data,
    staleTime: 1000 * 60 * 5,
    enabled: true,
  })
}
