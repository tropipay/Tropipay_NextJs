import { useEffect, useMemo, useState } from "react"
import useFilterParams from "./useFilterParams"

interface UrlParamsManagerProps {
  column?: { id?: string }
}

/**
 * Hook to manage filters.
 * @param {UrlParamsManagerProps} props - The props for the hook.
 * @returns {{ initialSelected: any; values: string[]; setValues: React.Dispatch<React.SetStateAction<string[]>>; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; updateValues: (event: React.ChangeEvent<HTMLInputElement>, fallbackId?: string) => void; setParams: (paramsObject: Record<string, string | number | boolean | object | null>) => void; }} An object containing the initialSelected, values, setValues, onSubmit, updateValues, and setParams functions.
 */
const useFiltersManager = ({ column }: UrlParamsManagerProps) => {
  const { setParams, getParam } = useFilterParams()
  const thisColumn = useMemo(() => column?.id || "", [column])

  const initialSelected = useMemo(() => {
    return getParam(thisColumn) || []
  }, [thisColumn, getParam])

  const [values, setValues] = useState<string[]>(initialSelected)

  useEffect(() => {
    setValues(JSON.parse(JSON.stringify(initialSelected)))
  }, [initialSelected])

  /**
   * Handles the submit event of the form.
   * @param {React.FormEvent<HTMLFormElement>} event - The submit event.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setParams({ [thisColumn]: values })
  }

  /**
   * Updates the values of the filters.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   * @param {string} fallbackId - The fallback ID.
   */
  function updateValues(
    event: React.ChangeEvent<HTMLInputElement>,
    fallbackId?: string
  ) {
    const currentValue = { ...values }
    const id = event.target.id || fallbackId
    if (!id) {
      console.error("No se pudo determinar el identificador del campo")
      return
    }

    currentValue[id as any] = event.target.value
    const filteredValues = Object.fromEntries(
      Object.entries(currentValue).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    )
    setValues(filteredValues as any)
  }

  return {
    initialSelected,
    values,
    setValues,
    onSubmit,
    updateValues,
    setParams,
  }
}

export default useFiltersManager
