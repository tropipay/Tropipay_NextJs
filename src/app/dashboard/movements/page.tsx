"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { movementsColumns } from "@/app/queryDefinitions/movements/movementsColumns"
import DataComponent from "@/components/DataComponent"
import { useSearchParams } from "next/navigation"
import PageClient from "./pageClient"

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
      <PageClient columns={movementsColumns} tableId={queryConfig.key ?? ""} />
    </DataComponent>
  )
}
