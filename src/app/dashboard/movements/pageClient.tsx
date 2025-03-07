"use client"

import DataTable from "@/components/table/dataTable"
import CookiesManager from "@/lib/cookiesManager"
import { getUserSettings } from "@/lib/utilsUser"
import { VisibilityState } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import MovementDetail from "./movementDetail"
import { toastMessage } from "@/lib/utilsUI"
import { FormattedMessage } from "react-intl"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { data: session } = useSession()

  const defaultUserSettings = {
    tableColumnsSettings: {
      ["movements"]: {
        columnOrder: [
          "select",
          "completedAt",
          "status",
          "amount",
          "movementType",
          "paymentMethod",
          "sender",
          "reference",
        ],
        columnSorting: [],
      },
    },
  }

  const userId = session?.user?.id
  const columnsSettings = defaultUserSettings.tableColumnsSettings

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

  console.log("columnsSettings:", columnsSettings)
  return (
    <div className="container p-2">
      {columnsSettings?.movements && data && (
        <DataTable
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
