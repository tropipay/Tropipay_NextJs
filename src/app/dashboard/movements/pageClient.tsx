"use client"

import DataTable from "@/components/table/dataTable"
import MovementDetail from "./movementDetail"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
  userId: string
}

const PageClient = ({ tableId, columns, data, userId }: Props) => {
  const queryConfig = apiConfig.movementsDetail

  const Detail = ({ row }: { row: any }) => {
    return (
      <DataComponent
        dehydratedState={undefined}
        queryConfig={queryConfig}
        key={queryConfig.key}
        searchParams={{ id: row.id }}
      >
        <MovementDetail />
      </DataComponent>
    )
  }

  return (
    <div className="container p-2">
      <DataTable
        tableId={tableId}
        columns={columns}
        data={data?.data?.movements?.items ?? []}
        rowCount={data?.data?.movements?.totalCount ?? 0}
        rowClickChildren={Detail}
        userId={userId}
      />
    </div>
  )
}

export default PageClient
