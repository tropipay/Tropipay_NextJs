"use client"

import { updateUserTableSettings } from "@/app/actions/userActions"
import DataTable from "@/components/table/dataTable"
import { TableColumnsSettings } from "@/types/tableColumnsSettings"
import { VisibilityState } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import React from "react"
import MovementDetail from "./movementDetail"

interface Props {
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ columns, data }: Props) => {
  const { data: session } = useSession()
  const user = session?.user
  const userId = user?.id

  const [columnsSettings, setColumnsSettings] =
    React.useState<TableColumnsSettings>()

  const onChangeColumnOrder = async (columnOrder: string[]) => {
    if (!userId || !columnsSettings) return
    await updateUserTableSettings(userId, {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnOrder },
    })
  }

  const onChangeColumnVisibility = async (
    columnVisibility: VisibilityState
  ) => {
    if (!userId || !columnsSettings) return
    await updateUserTableSettings(userId, {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnVisibility },
    })
  }

  const setUserTableColumnsSettings = async () => {
    if (userId) {
      /*       const { tableColumnsSettings } = await getUserTableSettings(userId)
      setColumnsSettings(tableColumnsSettings)
 */
    }
  }

  React.useEffect(() => {
    void setUserTableColumnsSettings()
  }, [])

  return (
    <div className="container p-2">
      <DataTable
        enableColumnOrder
        {...{
          data: data?.data?.movements?.items ?? [],
          columns,
          defaultColumnVisibility: {
            location: false,
            otherInformation: false,
          },
          onChangeColumnOrder,
          rowCount: data?.data?.movements?.totalCount ?? 0,
        }}
        rowClickChildren={MovementDetail}
      />
    </div>
  )
}

export default PageClient
