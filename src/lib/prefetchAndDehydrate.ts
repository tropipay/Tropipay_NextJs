// lib/prefetchAndDehydrate.js
import { QueryClient, dehydrate } from "@tanstack/react-query"

/**
 * Prefetch una consulta y deshidrata el estado del QueryClient.
 *
 * @param {Array} queries - Un array de objetos que contienen `queryKey` y `queryFn`.
 * @returns {Object} - Estado deshidratado del QueryClient.
 */
export async function prefetchAndDehydrate(queries) {
  const queryClient = new QueryClient()

  // Prefetch cada consulta proporcionada
  await Promise.all(
    queries.map(({ queryKey, queryFn, options }) =>
      queryClient.prefetchQuery({ queryKey, queryFn, ...options })
    )
  )

  // Deshidrata el estado del QueryClient
  return dehydrate(queryClient)
}
