import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"

export async function fetchData<T>(
  queryClient: QueryClient,
  queryConfig: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const queryKey = [generateHashedKey(queryConfig.key ?? "", urlParams)]
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
      }),
  })

  return queryClient.getQueryData<T>(queryKey) as T
}
