"use client"

import { defaultUserSettings } from "@/app/data/defaultUserSettings"
import DataTable from "@/components/table/dataTable"
import CookiesManager from "@/lib/cookiesManager"
import { VisibilityState } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import MovementDetail from "./movementDetail"

interface Props {
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ columns, data }: Props) => {
  const [columnsSettings, setColumnsSettings] =
    useState<UserTableColumnsSettings>()

  const { data: session } = useSession()
  const user = session?.user
  const userId = user?.id

  const onChangeColumnOrder = (columnOrder: string[]) => {
    const tableColumnsSettings = {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnOrder },
    }
    setColumnsSettings(tableColumnsSettings)
    if (userId || columnsSettings) {
      CookiesManager.getInstance().set(
        `userSettings-${userId}`,
        JSON.stringify({
          tableColumnsSettings,
        })
      )
      console.log("Columns order saved successfully")
    }
  }

  const onChangeColumnVisibility = (columnVisibility: VisibilityState) => {
    const tableColumnsSettings = {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnVisibility },
    }
    setColumnsSettings(tableColumnsSettings)

    if (userId && columnsSettings) {
      CookiesManager.getInstance().set(
        `userSettings-${userId}`,
        JSON.stringify({
          tableColumnsSettings,
        })
      )
      console.log("Columns visibility saved successfully")
    }
  }

  const getUserColumnsSettings = () =>
    setColumnsSettings(
      JSON.parse(
        CookiesManager.getInstance().get(
          `userSettings-${userId}`,
          JSON.stringify({ ...defaultUserSettings, id: userId })
        )
      ).tableColumnsSettings
    )

  useEffect(() => {
    !!userId && getUserColumnsSettings()
  }, [userId])

  return (
    <div className="container p-2">
      {columnsSettings && data && (
        <DataTable
          enableColumnOrder
          {...{
            columns,
            data: data.data.movements.items,
            rowCount: data.data.movements.totalCount,
            defaultColumnVisibility: columnsSettings.movements.columnVisibility,
            defaultColumnOrder: columnsSettings.movements.columnOrder,
            onChangeColumnOrder,
            onChangeColumnVisibility,
          }}
          rowClickChildren={MovementDetail}
        />
      )}
    </div>
  )
}

export default PageClient
