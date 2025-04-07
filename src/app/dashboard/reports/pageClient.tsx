"use client"

import { RowData } from "@/components/rowData/rowData"
import { FormattedMessage } from "react-intl" // Importar FormattedMessage
import InformationToolbar from "./informationToolbar"

const isBrowser = typeof window !== undefined

const pageClient = () => {
  const handleDownload = async () => {
    console.log("DOWNLOAAAAAAAAAAAAD:")
    const element = document.querySelector(".report-container")

    if (isBrowser && element) {
      const { default: html2pdf } = await import("html2pdf.js")
      const opt = {
        margin: 1,
        filename: "reporte_tropipay.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Aumentar escala para mejor calidad, useCORS si hay imágenes externas
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }
      // Generar y descargar el PDF
      html2pdf().from(element).set(opt).save()
    } else {
      console.error("Elemento .report-container no encontrado")
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <InformationToolbar handleDownload={handleDownload} />
        <div className="report-container">
          {/* Contenido del reporte que se convertirá a PDF */}
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
          <RowData
            label={<FormattedMessage id="total" />}
            value="2.704.240,62 EUR"
            style="resume"
          />
          <RowData
            label={<FormattedMessage id="balance" />}
            value={<FormattedMessage id="amount" />}
            style="row"
          />
          <RowData
            label={<FormattedMessage id="available_balance" />}
            value="2.704.240,62 EUR"
            style="resume"
          />
        </div>
      </div>
    </div>
  )
}

export default pageClient
