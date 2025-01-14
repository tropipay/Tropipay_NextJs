import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { makeApiRequest } from "./utilsApi"
import { generateHashedKey, urlParamsToFilter, urlParamsTyping } from "./utils"

export function useFetchData<T>({
  config,
  dehydratedState,
  urlParams,
}: any): UseQueryResult<T> {
  const { data: session } = useSession()
  const token = session?.user?.access_token

  const filter = urlParamsToFilter(urlParamsTyping(urlParams))
  const QueryKey = generateHashedKey(config.key, filter)

  return useQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        config,
        token,
        urlParams,
      }),
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify([QueryKey])
    )?.state?.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  })
}
