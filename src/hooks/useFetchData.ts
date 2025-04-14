import { useQuery } from "@tanstack/react-query"
import { fetchGetWithTriggers } from "@/utils/data/utils"

/**
 * Custom hook to fetch data from a URL.
 * @param {string[]} queryKey - The query key for react-query.
 * @param {string} url - The URL to fetch data from.
 * @param {boolean} isPublic - Whether the URL is public or not.
 * @param {Record<string, any>} filter - The filter to apply to the URL.
 * @returns {{ data: T | undefined; error: any; isLoading: boolean; isError: boolean; isSuccess: boolean; }} An object containing the data, error, loading state, error state, and success state.
 */
export function useFetchData<T>(
  queryKey: string[],
  url: string,
  isPublic = true,
  filter?: Record<string, any>
) {
  // Usamos `useQuery` para hacer la consulta
  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey,
    queryFn: () =>
      fetchGetWithTriggers({
        endpoint: url,
        isPublic,
        filter,
      }),
  })

  return {
    data: data as T | undefined, // Tipado genérico del JSON
    error,
    isLoading,
    isError,
    isSuccess,
  }
}
