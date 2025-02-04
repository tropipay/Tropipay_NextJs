import { Query, useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { generateHashedKey, urlParamsToFilter, urlParamsTyping } from "./utils"
import { makeApiRequest } from "./utilsApi"

export function useFetchData<T>({
  config,
  dehydratedState,
  urlParams,
}: any): UseQueryResult<T> {
  const { data: session } = useSession()
  const token = session?.user?.access_token
  const QueryKey = generateHashedKey(config.key, urlParams)

  return useQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        config,
        token,
        urlParams,
      }),
    initialData: dehydratedState.queries?.find(
      (query: Query) =>
        JSON.stringify(query.queryKey) === JSON.stringify([QueryKey])
    )?.state?.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  })
}
