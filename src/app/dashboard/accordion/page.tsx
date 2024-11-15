"use client"
import AccordionTPP from "@/components/customShadcn/AccordionTPP"
// import DestinationCountryStore from "@/stores/DestinationCountryStore"
import { useQuery } from "@tanstack/react-query"
import React from "react"

// You can define the query hook separately or directly within the component
const useDestinationCountryData = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => fetchGetWithTriggers(DestinationCountryStore.List),
  })
}

const Page = () => {
  // Fetch data using the custom hook
  const { data, isLoading, isError, error } = useDestinationCountryData()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error?.message}</div>
  }

  return (
    <AccordionTPP
      items={data}
      contract={{ title: "name", content: "updatedAt" }}
    />
  )
}

export default Page
