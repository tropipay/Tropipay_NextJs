"use client"

import { movementColumns } from "@/app/queryDefinitions/movements/movementColumns"
import { movements } from "@/app/queryDefinitions/movements/movements"
import DataTable from "@/components/table/dataTable"

export default function Home() {
  const onChangeColumnOrder = (columnOrder: string[]) =>
    console.log("Change column order to ", columnOrder)

  return (
    <div className="container p-2">
      <DataTable
        enableColumnOrder
        {...{
          data: movements,
          columns: movementColumns,
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
