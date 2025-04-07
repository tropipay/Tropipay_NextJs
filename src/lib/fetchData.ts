import { auth } from "@/auth"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"
import { getUserSettingsServer } from "./utilsServer"

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

  const columnVisibility = await getUserSettingsServer(
    userId,
    {},
    queryConfig.key,
    "columnVisibility"
  )

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: () =>
      makeApiRequest({
        queryConfig,
        variables,
        token,
        columnVisibility,
      }),
  })

  return queryClient.getQueryData<T>(queryKey) as T
}
