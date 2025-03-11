import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { auth } from "@/auth"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"
import { getUserSettingsServer } from "./utilsServer"

export async function fetchData<T>(
  queryClient: QueryClient,
  queryConfig: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const queryKey = [generateHashedKey(queryConfig.key ?? "", urlParams)]
  const variables = buildGraphQLVariables(urlParams, queryConfig.filters)
  const session = await auth()
  const { token, id: userId } = session?.user
  const userSettingsServer = await getUserSettingsServer(userId)
  const tableColumnsSettings = userSettingsServer
    ? userSettingsServer?.tableColumnsSettings
    : []

  const columnVisibility =
    tableColumnsSettings[queryConfig.key]?.columnVisibility ?? {}

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
