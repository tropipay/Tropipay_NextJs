"use client"

import { getSession } from "@/app/actions/sessionActions"
import {
  getUserTableSettings,
  updateUserTableSettings,
} from "@/app/actions/userActions"
import {
  defaultColumnOrder,
  defaultColumnVisibility,
} from "@/app/queryDefinitions/movements"
import { CustomColumnDef } from "@/app/queryDefinitions/movements/movementColumns"
import DataTable from "@/components/table/dataTable"
import { TableColumnsSettings } from "@/types/tableColumnsSettings"
import { VisibilityState } from "@tanstack/react-table"
import React from "react"

interface Props {
  columns: CustomColumnDef<Movement>[]
  data?: GetMovementsResponse
}

const PageClient = ({
  columns,
  data: {
    data: {
      movements: { items },
    },
  } = {
    data: { movements: { items: [], totalCount: 0 } },
  },
}: Props) => {
  const [userId, setUserId] = React.useState<string>()
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
    const session = await getSession()

    if (session?.user) {
      const userId = session.user.sub
      const { tableColumnsSettings } = await getUserTableSettings(userId)

      setUserId(userId)
      setColumnsSettings(tableColumnsSettings)
    }
  }

  React.useEffect(() => {
    setUserTableColumnsSettings()
  }, [])

  return (
    <div className="container p-2">
      <DataTable
        enableColumnOrder
        {...{
          data: items,
          columns,
          defaultColumnOrder:
            columnsSettings?.movements.columnOrder ?? defaultColumnOrder,
          defaultColumnVisibility:
            columnsSettings?.movements.columnVisibility ??
            defaultColumnVisibility,
          onChangeColumnOrder,
          onChangeColumnVisibility,
        }}
      />
    </div>
  )
}

export default PageClient
