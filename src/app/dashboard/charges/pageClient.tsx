"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import DataTable from "@/components/table/dataTable"
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

  const ChargeDetailContainer = ({ row }: { row: any }) => (
    <DataComponent
      key={queryConfig.key}
      {...{
        queryConfig,
        searchParams: { id: row.id },
        // mockData: { data: { charges: chargesMock } },
      }}
    >
      <ChargeDetail />
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
            data: data?.data?.charges?.items ?? [],
            rowCount: data?.data?.charges?.totalCount ?? 0,
            categoryFilterId: "state",
            categoryFilters: ["ALL", "caught", "declined"],
            rowClickChildren: ChargeDetailContainer,
          }}
        />
      )}
    </div>
  )
}

export default PageClient
