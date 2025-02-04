"use client"

import { CustomColumnDef } from "@/app/queryDefinitions/movements/movementColumns"
import DataTable from "@/components/table/dataTable"

interface Props {
  columns: CustomColumnDef<Movement>[]
  data?: GetMovementsResponse
}

const PageClient = ({
  columns,
  data: {
    data: {
      movements: { items, totalCount: rowCount },
    },
  } = {
    data: { movements: { items: [], totalCount: 0 } },
  },
}: Props) => {
  const onChangeColumnOrder = (columnOrder: string[]) =>
    console.log("Change column order to ", columnOrder)

  return (
    <div className="container p-2">
      <DataTable
        enableColumnOrder
        {...{
          data: items,
          columns,
          defaultColumnVisibility: {
            location: false,
            otherInformation: false,
          },
          onChangeColumnOrder,
          rowCount: rowCount * 100,
        }}
      />
    </div>
  )
}

export default PageClient
