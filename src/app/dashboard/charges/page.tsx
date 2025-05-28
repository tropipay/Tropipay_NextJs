"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { chargesColumns } from "@/app/queryDefinitions/charges/chargesColumns"
import DataComponent from "@/components/DataComponent"
import { useSearchParams } from "next/navigation"
import PageClient from "./pageClient"

export default function Page() {
  const searchParams = useSearchParams()
  const { charges: queryConfig } = apiConfig

  // Convertir URLSearchParams a objeto plano
  const searchParamsObj = Object.fromEntries(searchParams.entries())

  return (
    <DataComponent
      showLoading
      {...{
        queryConfig,
        searchParams: searchParamsObj,
      }}
    >
      <PageClient
        {...{
          columns: chargesColumns,
          tableId: queryConfig.key ?? "",
        }}
      />
    </DataComponent>
  )
}
