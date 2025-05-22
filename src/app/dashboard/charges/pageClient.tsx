"use client"

import ChargeDetailContainer from "@/components/charges/ChargeDetailContainer"
import DataTable from "@/components/table/DataTable"
import { GetChargesResponse } from "@/types/charges"
import { useSession } from "next-auth/react"

interface Props {
  tableId: string
  columns: any
  data?: GetChargesResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  console.log("data:", data)
  console.log("userId:", userId)
  console.log("tableId:", tableId)
  console.log("columns:", columns)
  console.log("data?.data?.charges?.items:", data?.data?.charges?.items)
  return (
    <div className="w-full">
      {userId && (
        <DataTable
          {...{
            tableId,
            userId,
            columns,
            data: data?.data?.charges?.items ?? [],
            rowCount: data?.data?.charges?.totalCount ?? 0,
            categoryFilterId: "state",
            categoryFilters: ["ALL", "CAPTURED", "DECLINED"],
            rowClickChildren: ChargeDetailContainer,
          }}
        />
      )}
    </div>
  )
}

export default PageClient
