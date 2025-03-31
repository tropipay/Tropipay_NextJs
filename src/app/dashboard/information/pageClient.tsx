"use client"

import { RowData } from "@/components/rowData/rowData"
import React from "react"
import InformationToolbar from "./informationToolbar"
import { Button } from "@/components/ui/button"

const pageClient = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
          <Button className="px-2 h-8">
            Resumen de saldo{" "}
            {/* <FormattedMessage id={`fc_${categoryFilter}`} /> */}
          </Button>
        </div>
        <InformationToolbar />
        <div>
          <RowData label="Resumen de saldo" value="Importe" style="header" />
          <RowData label="Balance inicial" value="0.00 EUR" style="row" />
          <RowData label="Ventas" value="4.948.830,91 EUR" style="row" />
          <RowData label="Reembolsos" value="1.547,92 EUR" style="row" />
          <RowData label="Comisiones" value="198.042,82 EUR" style="row" />
          <RowData label="Neto" value="4.749.240,17 EUR" style="resume" />

          <RowData label="Comisiones" value="196.643,92 EUR" style="row" />
          <RowData label="Cobro con tarjeta" value="530,10 EUR" style="row" />
          <RowData
            label="Transferencias internas"
            value="4.948.830,91 EUR"
            style="row"
          />
          <RowData
            label="Transferencias externas de salida"
            value="868,80 EUR"
            style="row"
          />
          <RowData label="Total" value="198.042,82 EUR" style="resume" />

          <RowData label="Envíos" value="Importe" style="header" />
          <RowData label="Envíos" value="2.704.240,62 EUR" style="row" />
        </div>
      </div>
    </div>
  )
}

export default pageClient
