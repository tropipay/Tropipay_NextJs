import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { auth } from "@/auth"
import { QueryClient } from "@tanstack/react-query"
import { makeApiRequest } from "./utilsApi"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const session = await auth()

  await queryClient.prefetchQuery({
    queryKey: [config.key],
    queryFn: () =>
      makeApiRequest({
        config,
        token: session?.user?.access_token,
        urlParams,
      }),
  })

  return queryClient.getQueryData<T>(config.key) as T
}
