"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import ChargeDetail from "./ChargeDetail"

interface Props {
  row: any
}

const ChargeDetailContainer = ({ row }: Props) => {
  const queryConfig = apiConfig.chargesDetail

  return (
    <DataComponent
      key={queryConfig.key}
      showLoading
      {...{
        queryConfig,
        searchParams: { id: row.id },
      }}
    >
      <ChargeDetail />
    </DataComponent>
  )
}

export default ChargeDetailContainer
