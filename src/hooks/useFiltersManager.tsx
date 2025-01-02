import { useState, useMemo, useEffect } from "react"
import useFilterParams from "./useFilterParams"

interface UrlParamsManagerProps {
  column?: { id?: string }
}

const useFiltersManager = ({ column }: UrlParamsManagerProps) => {
  const { setParam, getParam } = useFilterParams()
  const thisColumn = useMemo(() => column?.id || "", [column])

  const initialSelected = useMemo(() => {
    return getParam(thisColumn) || []
  }, [thisColumn, getParam])

  const [values, setValues] = useState<string[]>(initialSelected)

  useEffect(() => {
    setValues(JSON.parse(JSON.stringify(initialSelected)))
  }, [initialSelected])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setParam(thisColumn, values)
  }

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

    currentValue[id] = event.target.value
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
