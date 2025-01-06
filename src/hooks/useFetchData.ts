import { useQuery } from "@tanstack/react-query"
import { fetchGetWithTriggers } from "@/lib/utils"

// Hook personalizado para obtener datos de una URL
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
