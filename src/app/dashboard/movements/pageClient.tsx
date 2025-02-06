"use client"

import { CustomColumnDef } from "@/app/queryDefinitions/movements/movementColumns"
import DataTable from "@/components/table/dataTable"

interface Props {
  columns: CustomColumnDef<Movement>[]
  filters: any
  data?: GetMovementsResponse
}

const PageClient = ({
  columns,
  filters,
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
          filters,
          defaultColumnVisibility: {
            location: false,
            otherInformation: false,
          },
          onChangeColumnOrder,
          rowCount: rowCount,
        }}
      />
    </div>
  )
}

export default PageClient
