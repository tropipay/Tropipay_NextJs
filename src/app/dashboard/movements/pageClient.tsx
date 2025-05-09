"use client"

import MovementDetailContainer from "@/components/movements/MovementDetailContainer"
import DataTable from "@/components/table/DataTable"
import { GetMovementsResponse } from "@/types/movements"
import { useSession } from "next-auth/react"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  return (
    <div className="w-full p-2">
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
