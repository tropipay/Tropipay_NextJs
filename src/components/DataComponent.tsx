"use client"

import React from "react"
import { DehydratedState } from "@tanstack/react-query"
import { useFetchData } from "@/lib/useFetchData"
import { FetchDataConfig } from "@/app/queryDefinitions/types"

interface DataComponentProps {
  dehydratedState: DehydratedState
  children: React.ReactElement<{ data: any }>
  config: FetchDataConfig
}

export default function DataComponent({
  dehydratedState,
  config,
  children,
}: DataComponentProps) {
  const { data, error, isLoading } = useFetchData({
    config,
    dehydratedState,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return React.cloneElement(children, { data })
}
