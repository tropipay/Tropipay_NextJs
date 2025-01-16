import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { auth } from "@/auth"
import { QueryClient } from "@tanstack/react-query"
import { makeApiRequest } from "./utilsApi"
import { generateHashedKey, urlParamsToFilter, urlParamsTyping } from "./utils"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const session = await auth()
  const filter = urlParamsToFilter(urlParamsTyping(urlParams))
  const QueryKey = generateHashedKey(config.key, filter)

  await queryClient.prefetchQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        config,
        token: session?.user?.access_token,
        urlParams,
      }),
  })

  return queryClient.getQueryData<T>(QueryKey) as T
}
