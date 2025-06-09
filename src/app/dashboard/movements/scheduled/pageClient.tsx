"use client"

import MovementScheduledDetailContainer from "@/components/movements/MovementScheduledDetailContainer"
import DataTable from "@/components/ui/table/DataTable"
import ProfileStore from "@/stores/ProfileStore"
import { GetMovementsScheduledResponse } from "@/types/movements"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsScheduledResponse
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
