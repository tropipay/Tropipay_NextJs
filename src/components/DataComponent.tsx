"use client"

import React from "react"
import { DehydratedState } from "@tanstack/react-query"
import { useFetchData } from "@/lib/useFetchData"
import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { movements } from "@/app/queryDefinitions/movements/movements"
import { parseParamsString } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

interface DataComponentProps {
  dehydratedState: DehydratedState
  children: React.ReactElement<{ data: any }>
  filters: any
  config: FetchDataConfig
}

export default function DataComponent({
  dehydratedState,
  config,
  children,
}: DataComponentProps) {
  const urlParams = useSearchParams()
  const { data, error, isLoading } = useFetchData({
    config,
    dehydratedState,
    urlParams,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  // START - REMOVE THIS LINES
  const newData = data || { data: { movements } }
  return React.cloneElement(children, { data: newData })
  // END - REMOVE THIS LINES

  return React.cloneElement(children, { data })
}
