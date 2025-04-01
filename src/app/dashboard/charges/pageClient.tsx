"use client"

import DataTable from "@/components/table/dataTable"
import { useSession } from "next-auth/react"

interface Props {
  tableId: string
  columns: any
  data?: GetChargesResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  return (
    <div className="container p-2">
      {userId && (
        <DataTable
          {...{
            tableId,
            userId,
            columns,
            data: data?.data?.charges?.items ?? [],
            rowCount: data?.data?.charges?.totalCount ?? 0,
            categoryFilterId: "chargeDirection",
            categoryFilters: ["ALL", "CAUGHT", "DECLINED"],
          }}
        />
      )}
    </div>
  )
}

export default PageClient
