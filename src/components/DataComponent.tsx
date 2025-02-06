"use client"

import React from "react"
import { DehydratedState } from "@tanstack/react-query"
import { useFetchData } from "@/lib/useFetchData"
import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { movements } from "@/app/queryDefinitions/movements/movements"
import { useSearchParams } from "next/navigation"
import { searchParamsToObject } from "@/lib/utils"

interface DataComponentProps {
  dehydratedState: DehydratedState
  children: React.ReactElement<{ data: any }>
  filters: any
  queryConfig: FetchDataConfig
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  children,
}: DataComponentProps) {
  const urlParams = searchParamsToObject(useSearchParams())
  const { data, error, isLoading } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  // START - REMOVE THIS LINES
  const newData = data || { data: { movements } }

  console.log("******************************** data:", data)
  return React.cloneElement(children, { data: newData })
  // END - REMOVE THIS LINES

  return React.cloneElement(children, { data })
}
