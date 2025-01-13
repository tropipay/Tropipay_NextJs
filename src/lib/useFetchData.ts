import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { makeApiRequest } from "./utilsApi"
import { FetchDataConfig } from "@/app/queryDefinitions/types"

export function useFetchData<T>({
  config,
  dehydratedState,
  urlParams,
}: any): UseQueryResult<T> {
  const { data: session } = useSession()
  const token = session?.user?.access_token

  return useQuery({
    queryKey: [config.key],
    queryFn: () =>
      makeApiRequest({
        config,
        token,
        urlParams,
      }),
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify([config.key])
    )?.state?.data,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  })
}
