import { getSession } from "@/app/actions/sessionActions"
import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey, urlParamsToFilter, urlParamsTyping } from "./utils"
import { makeApiRequest } from "./utilsApi"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const session = await getSession()
  const QueryKey = generateHashedKey(config.key ?? "", urlParams)

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
