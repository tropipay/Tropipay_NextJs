import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig
): Promise<T> {
  await queryClient.prefetchQuery({
    queryKey: [config.key],
    queryFn: async () => {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: JSON.stringify(config.body),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      return response.json()
    },
  })

  return queryClient.getQueryData<T>(config.key) as T
}
