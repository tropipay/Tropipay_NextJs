import { QueryClient } from "@tanstack/react-query"
import { cache } from "react"

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 20 * 60 * 1000,
        },
      },
    })
)
export default getQueryClient
