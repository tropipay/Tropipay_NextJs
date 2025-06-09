"use client"

import ChargeDetailContainer from "@/components/charges/ChargeDetailContainer"
import DataTable from "@/components/ui/table/DataTable"
import ProfileStore from "@/stores/ProfileStore"
import { GetChargesResponse } from "@/types/charges"

interface Props {
  tableId: string
  columns: any
  data?: GetChargesResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const userId = (ProfileStore?.getProfileData() as any)?.id

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
