"use client"

import { RowData } from "@/components/rowData/rowData"
import React from "react"
import InformationToolbar from "./informationToolbar"
import { Button } from "@/components/ui/button"
import { FormattedMessage } from "react-intl" // Importar FormattedMessage

const pageClient = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
          <Button className="px-2 h-8">
            <FormattedMessage id="balance_summary" />{" "}
            {/* <FormattedMessage id={`fc_${categoryFilter}`} /> */}
          </Button>
        </div>
        <InformationToolbar />
        <div>
          <RowData
            label={<FormattedMessage id="balance_summary" />}
            value={<FormattedMessage id="amount" />}
            style="header"
          />
          <RowData
            label={<FormattedMessage id="initial_balance" />}
            value="0.00 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="sales" />}
            value="4.948.830,91 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="refunds" />}
            value="1.547,92 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="commissions" />}
            value="198.042,82 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="net" />}
            value="4.749.240,17 EUR"
            style="resume"
          />

          <RowData
            label={<FormattedMessage id="commissions" />}
            value="196.643,92 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="card_payment" />}
            value="530,10 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="internal_transfers" />}
            value="4.948.830,91 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="outgoing_external_transfers" />}
            value="868,80 EUR"
            style="row"
          />
          <RowData
            label={<FormattedMessage id="total" />}
            value="198.042,82 EUR"
            style="resume"
          />

          <RowData
            label={<FormattedMessage id="shipments" />}
            value={<FormattedMessage id="amount" />}
            style="header"
          />
          <RowData
            label={<FormattedMessage id="shipments" />}
            value="2.704.240,62 EUR"
            style="row"
          />
        </div>
      </div>
    </div>
  )
}

export default pageClient
