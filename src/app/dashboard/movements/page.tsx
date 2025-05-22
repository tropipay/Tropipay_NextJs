"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import PageClient from "./pageClient"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const queryConfig = apiConfig.movements

  return (
    <DataComponent
      {...{
        queryConfig,
        searchParams: Object.fromEntries(searchParams.entries()),
      }}
    >
      <PageClient
        columns={queryConfig.columns}
        tableId={queryConfig.key ?? ""}
      />
    </DataComponent>
  )
}
