"use client"

import DataTable from "@/components/table/dataTable"
import CookiesManager from "@/lib/cookiesManager"
import { toastMessage } from "@/lib/uiUtils"
import { getUserSettings } from "@/lib/utilsUser"
import { VisibilityState } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { FormattedMessage } from "react-intl"
import MovementDetail from "./movementDetail"

interface Props {
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ columns, data }: Props) => {
  const tableId = "movements"
  const { data: session } = useSession()
  const userId = session?.user?.id
  const columnsSettings = userId
    ? getUserSettings(userId).tableColumnsSettings
    : null

  const onChangeColumnOrder = (columnOrder: string[]) => {
    if (!userId) return
    const columnsSettings = getUserSettings(userId).tableColumnsSettings

    const tableColumnsSettings = {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnOrder },
    }

    CookiesManager.getInstance().set(`userSettings-${userId}`, {
      tableColumnsSettings,
    })
    console.log("Columns order saved successfully")
  }

  const onChangeColumnVisibility = (columnVisibility: VisibilityState) => {
    if (!userId) return
    const columnsSettings = getUserSettings(userId).tableColumnsSettings

    const tableColumnsSettings = {
      ...columnsSettings,
      movements: { ...columnsSettings.movements, columnVisibility },
    }

    CookiesManager.getInstance().set(`userSettings-${userId}`, {
      tableColumnsSettings,
    })
    console.log("Columns visibility saved successfully")
  }

  if (!data?.data?.movements?.items.length) {
    toastMessage(
      <FormattedMessage id="no_movements" />,
      <FormattedMessage id="no_movements_display" />
    )
  }

  return (
    <div className="container p-2">
      {columnsSettings?.movements && data && (
        <DataTable
          enableColumnOrder
          {...{
            tableId,
            columns,
            data: data?.data?.movements?.items ?? [],
            rowCount: data?.data?.movements?.totalCount ?? 0,
            ...(columnsSettings.movements.columnOrder && {
              defaultColumnOrder: columnsSettings.movements.columnOrder,
            }),
            ...(columnsSettings.movements.columnVisibility && {
              defaultColumnVisibility:
                columnsSettings.movements.columnVisibility,
            }),
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
