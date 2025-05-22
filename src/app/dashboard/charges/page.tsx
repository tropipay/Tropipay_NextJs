"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import PageClient from "./pageClient"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const { charges: queryConfig } = apiConfig
  const { columns, key } = queryConfig

  // Convertir URLSearchParams a objeto plano
  const searchParamsObj = Object.fromEntries(searchParams.entries())

  return (
    <DataComponent
      {...{
        queryConfig,
        searchParams: searchParamsObj,
      }}
    >
      <PageClient
        {...{
          columns,
          tableId: key ?? "",
        }}
      />
    </DataComponent>
  )
}
