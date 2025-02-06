import { getSession } from "@/app/actions/sessionActions"
import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey, urlParamsToFilter, urlParamsTyping } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"

export async function fetchData<T>(
  queryClient: QueryClient,
  queryConfig: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const session = await getSession()
  const QueryKey = generateHashedKey(queryConfig.key ?? "", urlParams)
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)

  await queryClient.prefetchQuery({
    queryKey: [QueryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        token: session?.user?.access_token,
        variables,
      }),
  })

  return queryClient.getQueryData<T>(QueryKey) as T
}
