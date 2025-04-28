"use client"

import DataTable from "@/components/table/DataTable"
import { GetMovementsScheduledResponse } from "@/types/movements"
import { useSession } from "next-auth/react"
import MovementScheduledDetail from "./MovementScheduledDetail"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsScheduledResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const MovementScheduledDetailContainer = ({ row }: { row: any }) => (
    <MovementScheduledDetail {...{ data: row }} />
  )

  return (
    <div className="w-full p-2">
      {userId && (
        <DataTable
          {...{
            tableId,
            userId,
            columns,
            data: data?.rows ?? [],
            rowCount: data?.count ?? 0,
            rowClickChildren: MovementScheduledDetailContainer,
            enableToolbar: false,
          }}
        />
      )}
    </div>
  )
}

export default PageClient
