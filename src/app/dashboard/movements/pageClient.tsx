"use client"

import DataTable from "@/components/table/dataTable"
import MovementDetail from "./movementDetail"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
  userId: string
}

const PageClient = ({ tableId, columns, data, userId }: Props) => {
  return (
    <div className="container p-2">
      <DataTable
        tableId={tableId}
        columns={columns}
        data={data?.data?.movements?.items ?? []}
        rowCount={data?.data?.movements?.totalCount ?? 0}
        rowClickChildren={MovementDetail}
        userId={userId}
      />
    </div>
  )
}

export default PageClient
