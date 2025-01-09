import { QueryClient } from "@tanstack/react-query"

interface FetchDataConfig {
  url: string
  method: string
  headers: Record<string, string>
  body?: Record<string, any>
}

export async function fetchData<T>(
  queryClient: QueryClient,
  key: string[],
  config: FetchDataConfig
): Promise<T> {
  await queryClient.prefetchQuery({
    queryKey: key,
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

  return queryClient.getQueryData<T>(key) as T
}
