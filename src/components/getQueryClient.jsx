import { QueryClient } from "@tanstack/react-query"
import { cache } from "react"

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 4000 * 60 * 5,
        },
      },
    })
)
export default getQueryClient
