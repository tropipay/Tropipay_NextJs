import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
import { generateHashedKey, primitiveArray } from "./utils"
import { buildGraphQLVariables, makeApiRequest } from "./utilsApi"
import { auth } from "@/auth"

export async function fetchData<T>(
  queryClient: QueryClient,
  queryConfig: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const queryKey = [generateHashedKey(queryConfig.key ?? "", urlParams)]
  const filters = primitiveArray(queryConfig.columns)
  const variables = buildGraphQLVariables(urlParams, filters)
  console.log("variables server:", variables)
  const session = await auth()
  const token = session?.user.token

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
