"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

interface FetchDataOptions {
  endpointKey: keyof typeof apiConfig
  queryKey: string[]
  variables?: Record<string, any>
  dehydratedState: any
}

export function useFetchData<T>({
  endpointKey,
  queryKey,
  variables,
  dehydratedState,
}: FetchDataOptions): UseQueryResult<T> {
  const config = apiConfig[endpointKey]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: JSON.stringify({
          ...config.body,
          variables: variables ?? config.body.variables,
        }),
        cache: "no-store",
      })

      if (!response.ok) throw new Error("Error fetching data")
      return response.json()
    },
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify(queryKey)
    )?.state?.data,

    staleTime: 1000 * 60 * 5, // Mantiene los datos frescos durante 5 minutos
  })
}
