import { auth } from "@/auth"
import { FetchDataConfig } from "@/types/fetchData"
import { buildGraphQLVariables, makeApiRequest } from "@/utils/api/utilsApi"
import { generateHashedKey } from "@/utils/data/utils"
import { QueryClient } from "@tanstack/react-query"

/**
 * Fetches data from the API.
 * @param {QueryClient} queryClient The TanStack Query client.
 * @param {FetchDataConfig} queryConfig The query configuration.
 * @param {any} urlParams The URL parameters.
 * @returns {Promise<T>} The data fetched from the API.
 */
export async function fetchData<T>(
  queryClient: QueryClient,
  queryConfig: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const queryKey = [generateHashedKey(queryConfig.key ?? "", urlParams)]
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)
  const session = await auth()
  const { token, id: userId } = session?.user

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
        token,
      }),
  })

  return queryClient.getQueryData<T>(queryKey) as T
}
