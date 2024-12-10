import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"

const useFilterParams = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  /**
   * Verifica si un valor es considerado "vacío".
   */
  const isEmptyValue = (value: any): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === "string" && value.trim() === "") return true
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true
    return false
  }

  /**
   * Serializa el valor antes de asignarlo al query param.
   */
  const serializeValue = (
    value: string | number | boolean | object
  ): string => {
    return typeof value === "object" ? JSON.stringify(value) : value.toString()
  }

  /**
   * Deserializa el valor leído del query param.
   */
  const deserializeValue = (value: string | null): any => {
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return value // Devuelve el valor como string si no es JSON válido
    }
  }

  /**
   * Método para establecer o eliminar un parámetro en la URL.
   */
  const setParam = useCallback(
    (
      paramName: string,
      queryValue: string | number | boolean | object | null
    ) => {
      const params = new URLSearchParams(searchParams?.toString() || "")

      if (isEmptyValue(queryValue)) {
        params.delete(paramName) // Elimina si el valor es vacío
      } else {
        params.set(paramName, serializeValue(queryValue))
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, pathname, replace]
  )

  /**
   * Método para obtener el valor de un parámetro desde la URL.
   */
  const getParam = useCallback(
    (paramName: string): any => {
      const params = new URLSearchParams(searchParams?.toString() || "")
      return deserializeValue(params.get(paramName))
    },
    [searchParams]
  )

  return { setParam, getParam }
}

export default useFilterParams
