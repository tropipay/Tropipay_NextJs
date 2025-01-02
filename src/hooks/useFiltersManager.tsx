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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setParam(thisColumn, values)
  }

  return {
    initialSelected,
    values,
    setValues,
    onSubmit,
  }
}

export default useFiltersManager
