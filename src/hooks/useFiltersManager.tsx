import { useState, useMemo, useEffect } from "react"
import useFilterParams from "./useFilterParams"

interface UrlParamsManagerProps {
  column?: { id?: string }
}

const useFiltersManager = ({ column }: UrlParamsManagerProps) => {
  const { setParam, getParam } = useFilterParams()
  const thisColumn = useMemo(() => column?.id || "", [column])

  const initialSelected = useMemo(
    () => getParam(thisColumn) || [],
    [getParam, thisColumn]
  )

  const [values, setValues] = useState<string[]>(initialSelected)

  useEffect(() => {
    setValues(initialSelected)
  }, [initialSelected])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setParam(thisColumn, values)
  }

  function updateValues(event: React.ChangeEvent<HTMLInputElement>) {
    const currentValue = { ...values }
    currentValue[event.target.id] = event.target.value
    const filteredValues = Object.fromEntries(
      Object.entries(currentValue).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    )
    setValues(filteredValues)
  }

  return {
    initialSelected,
    values,
    setValues,
    onSubmit,
    updateValues,
  }
}

export default useFiltersManager
