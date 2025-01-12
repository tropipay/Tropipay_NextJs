"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface FetchDataOptions {
  config: FetchDataConfig
  variables?: Record<string, any>
  dehydratedState: any
}

export function useFetchData<T>({
  config,
  variables,
  dehydratedState,
}: FetchDataOptions): UseQueryResult<T> {
  const { data: session } = useSession()
  const token = session?.user?.access_token

  return useQuery({
    queryKey: [config.key],
    queryFn: async () => {
      const headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const response = await fetch(config.url, {
        method: config.method,
        headers,
        body: JSON.stringify({
          ...config.body,
          variables: variables ?? config.body?.variables,
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message ||
            `Error fetching data: ${response.status} ${response.statusText}`
        )
      }

      return response.json()
    },
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify([config.key])
    )?.state?.data,
    staleTime: 1000 * 60 * 5, // 5 minutos
    // Opcional: deshabilitar la query si no hay token
    enabled: !!token,
  })
}
