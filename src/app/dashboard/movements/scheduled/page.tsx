"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import PageClient from "./pageClient"
import { useSearchParams } from "next/navigation"

export default function Page() {
  const searchParams = useSearchParams()
  const queryConfig = apiConfig.movementsScheduled
  const size = searchParams.get("size") ?? "50"
  const page = searchParams.get("page") ?? "0"

  return (
    <DataComponent
      {...{
        queryConfig,
        searchParams: {
          offset: (parseInt(page) * parseInt(size)).toString(),
          limit: size,
        },
      }}
    >
      <PageClient
        columns={queryConfig.columns}
        tableId={queryConfig.key ?? ""}
      />
    </DataComponent>
  )
}
