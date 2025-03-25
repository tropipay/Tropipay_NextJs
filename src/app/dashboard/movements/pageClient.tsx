"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import DataTable from "@/components/table/dataTable"
import { useSession } from "next-auth/react"
import MovementDetail from "./movementDetail"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id
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
      {userId && (
        <DataTable
          tableId={tableId}
          columns={columns}
          data={data?.data?.movements?.items ?? []}
          rowCount={data?.data?.movements?.totalCount ?? 0}
          rowClickChildren={Detail}
          userId={userId}
          categoryFilterId={"movementDirection"}
          categoryFilters={["ALL", "IN", "OUT"]}
        />
      )}
    </div>
  )
}

export default PageClient
