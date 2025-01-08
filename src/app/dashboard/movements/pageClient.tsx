"use client"
import DataTable from "@/components/table/dataTable"
import React from "react"

const pageClient = (props) => {
  const onChangeColumnOrder = (columnOrder: string[]) =>
    console.log("Change column order to ", columnOrder)

  return (
    <div className="container p-2">
      <DataTable
        enableColumnOrder
        {...{
          data: props.data,
          columns: props.columns,
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

export default pageClient
