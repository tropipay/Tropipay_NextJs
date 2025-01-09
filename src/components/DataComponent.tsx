"use client"

import React from "react"
import { DehydratedState } from "@tanstack/react-query"
import { useFetchData } from "@/lib/useFetchData"

interface DataComponentProps {
  dehydratedState: DehydratedState
  endpointKey: keyof typeof import("@/app/queryDefinitions/apiConfig").apiConfig
  queryKey: string[]
  variables?: Record<string, any>
  children: React.ReactElement<{ data: any }>
}

export default function DataComponent({
  dehydratedState,
  endpointKey,
  queryKey,
  variables,
  children,
}: DataComponentProps) {
  const { data, error, isLoading } = useFetchData({
    endpointKey,
    queryKey,
    variables,
    dehydratedState,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return React.cloneElement(children, { data })
}
