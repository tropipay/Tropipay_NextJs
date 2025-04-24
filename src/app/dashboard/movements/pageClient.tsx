"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import DataTable from "@/components/table/DataTable"
import { GetMovementsResponse } from "@/types/movements"
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

  const MovementDetailContainer = ({ row }: { row: any }) => (
    <DataComponent
      key={queryConfig.key}
      showLoading
      {...{
        queryConfig,
        searchParams: { id: row.id },
      }}
    >
      <MovementDetail />
    </DataComponent>
  )

  return (
    <div className="container p-2">
      {userId && (
        <DataTable
          {...{
            tableId,
            userId,
            columns,
            data: data?.data?.movements?.items ?? [],
            rowCount: data?.data?.movements?.totalCount ?? 0,
            categoryFilterId: "movementDirection",
            categoryFilters: ["ALL", "IN", "OUT"],
            rowClickChildren: MovementDetailContainer,
          }}
        />
      )}
    </div>
  )
}

export default PageClient
