"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { movementsScheduledColumns } from "@/app/queryDefinitions/movements/scheduled/movementsScheduledColumns"
import DataComponent from "@/components/DataComponent"
import { useSearchParams } from "next/navigation"
import PageClient from "./pageClient"

export default function Page() {
  const searchParams = useSearchParams()
  const queryConfig = apiConfig.movementsScheduled
  const size = searchParams.get("size") ?? "50"
  const page = searchParams.get("page") ?? "0"

  return (
    <DataComponent
      showLoading
      {...{
        queryConfig,
        searchParams: {
          offset: (parseInt(page) * parseInt(size)).toString(),
          limit: size,
        },
      }}
    >
      <PageClient
        columns={movementsScheduledColumns}
        tableId={queryConfig.key ?? ""}
      />
    </DataComponent>
  )
}
