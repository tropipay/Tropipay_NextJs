"use client"
import AccordionTPP from "@/components/customShadcn/AccordionTPP"
import { fetchGetWithTriggers } from "@/lib/utils"
import DestinationCountryStore from "@/stores/DestinationCountryStore"
import { useQuery } from "@tanstack/react-query"
import React from "react"

const Page = () => {
  function ProcessStore(store) {
    return useQuery({
      queryKey: ["items"],
      queryFn: () => fetchGetWithTriggers(store),
    })
  }

  const { data } = ProcessStore(DestinationCountryStore.List)

  return (
    <AccordionTPP
      items={data}
      contract={{ title: "name", content: "updatedAt" }}
    />
  )
}

export default Page
