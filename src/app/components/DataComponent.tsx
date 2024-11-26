"use client"

import { useQuery, DehydratedState } from "@tanstack/react-query"
import React from "react"

interface DataComponentProps {
  dehydratedState: DehydratedState
  queryKey: string[]
  fetchURL: string
  children: React.ReactElement<{ data: any }>
}

export default function DataComponent({
  dehydratedState,
  queryKey,
  fetchURL,
  children,
}: DataComponentProps) {
  const fetchData = async () => {
    const res = await fetch(fetchURL)
    if (!res.ok) throw new Error("Error fetching data")
    return res.json()
  }

  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: fetchData,
    initialData: dehydratedState.queries?.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify(queryKey)
    )?.state?.data,
    staleTime: 1000 * 60 * 5, // Mantiene los datos frescos durante 5 minutos
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return React.cloneElement(children, { data })
}
