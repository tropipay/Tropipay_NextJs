import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
import { auth } from "@/auth"
import { urlParamsToFilter, urlParamsTyping } from "./utils"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig,
  urlParams: any
): Promise<T> {
  const session = await auth()
  const filter = urlParamsToFilter(urlParamsTyping(urlParams))
  await queryClient.prefetchQuery({
    queryKey: [config.key],
    queryFn: async () => {
      const headers = {
        ...config.headers,
        Authorization: `Bearer ${session?.user?.access_token}`,
        "Content-Type": "application/json",
      }
      const body = {
        ...config.body,
        variables: {
          ...config.body?.variables,
          filter,
        },
      }

      console.log("********************** body:", body)

      const response = await fetch(config.url, {
        method: config.method,
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message ||
            `Failed to fetch data: ${response.status} ${response.statusText}`
        )
      }

      return response.json()
    },
  })

  return queryClient.getQueryData<T>(config.key) as T
}

interface ErrorResponse {
  message: string
  status: number
  [key: string]: any
}
