"use client"

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

  return (
    <div className="container p-2">
      <DataTable
        tableId={tableId}
        columns={columns}
        data={data?.data?.movements?.items ?? []}
        rowCount={data?.data?.movements?.totalCount ?? 0}
        userId={userId}
        rowClickChildren={MovementDetail}
      />
    </div>
  )
}

export default PageClient
