// app/dashboard/ejemplo/DataComponent.tsx
"use client"

import { useQuery } from "@tanstack/react-query"

interface DataComponentProps {
  dehydratedState: any
  fetchURL: string
}

const fetchData = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al obtener los datos")
  return res.json()
}

export default function DataComponent({
  dehydratedState,
  fetchURL,
}: DataComponentProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: () => fetchData(fetchURL),
    placeholderData: dehydratedState.queries?.[0]?.state?.data,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div>{JSON.stringify(data)}</div>
}
