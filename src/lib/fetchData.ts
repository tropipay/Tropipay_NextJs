import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { QueryClient } from "@tanstack/react-query"
// Importación correcta para next-auth v5
import { auth } from "@/auth"

export async function fetchData<T>(
  queryClient: QueryClient,
  config: FetchDataConfig
): Promise<T> {
  // Obtener la sesión usando la nueva sintaxis de v5
  const session = await auth()

  await queryClient.prefetchQuery({
    queryKey: [config.key],
    queryFn: async () => {
      // Combinar los headers existentes con el header de autorización
      const headers = {
        ...config.headers,
        Authorization: `Bearer ${session?.user?.access_token}`,
        "Content-Type": "application/json",
      }

      const response = await fetch(config.url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
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
