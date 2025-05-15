"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import React from "react"
import PageClient from "./pageClient"

export default function Page({ params }) {
  const queryConfig = apiConfig.movementsScheduled

  return (
    <DataComponent
      key={queryConfig.key}
      showLoading
      {...{
        queryConfig,
        searchParams: React.use(params),
      }}
    >
      <PageClient
        columns={queryConfig.columns}
        tableId={queryConfig.key ?? ""}
      />
    </DataComponent>
  )
}
