"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

/**
 * Hook to manage filter parameters in the URL.
 * @returns {{ setParams: (paramsObject: Record<string, string | number | boolean | object | null>) => void; getParam: (paramName: string) => any; }} An object containing the setParams and getParam functions.
 */
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
    if (Array.isArray(value) && value.length === 0) return true
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
      return value
    }
  }

  /**
   * Método para establecer o eliminar un parámetro en la URL.
   */
  const setParams = (
    paramsObject: Record<string, string | number | boolean | object | null>
  ) => {
    const params = new URLSearchParams(searchParams?.toString() || "")

    Object.entries(paramsObject).forEach(([paramName, queryValue]) => {
      if (
        isEmptyValue(queryValue) ||
        queryValue === undefined ||
        queryValue === null ||
        queryValue === ""
      ) {
        params.delete("_" + paramName)
      } else {
        params.set("_" + paramName, serializeValue(queryValue ?? ""))
      }
    })

    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  /**
   * Método para obtener el valor de un parámetro desde la URL.
   */
  const getParam = useCallback(
    (paramName: string): any => {
      const params = new URLSearchParams(searchParams?.toString() || "")
      return deserializeValue(params.get("_" + paramName))
    },
    [searchParams]
  )

  return { setParams, getParam }
}

export default useFilterParams
