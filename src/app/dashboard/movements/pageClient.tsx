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
      movements: { items },
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
        }}
      />
    </div>
  )
}

export default PageClient
