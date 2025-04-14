"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import DataTable from "@/components/table/DataTable"
import { useSession } from "next-auth/react"
import ChargeDetail from "./chargeDetail"

interface Props {
  tableId: string
  columns: any
  data?: GetChargesResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const queryConfig = apiConfig.chargesDetail

  const ChargeDetailContainer = ({ row }: { row: any }) => {
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
