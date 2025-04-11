"use client"

import ReportFooter from "@/components/reports/ReportFooter"
import ReportHeader from "@/components/reports/ReportHeader"
import { RowData } from "@/components/rowData/rowData"
import { useState } from "react"
import { FormattedMessage } from "react-intl" // Importar FormattedMessage
import InformationToolbar from "./informationToolbar"

const isBrowser = typeof window !== undefined

const PageClient = () => {
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Handles the download of the report as a PDF.
   * @async
   */
  const handleDownload = async () => {
    // Get the HTML element for generation
    const reportContainerElement = document.querySelector(".report-container")

    // Create a dynamic element and pass HTML content to it
    const element = document.createElement("div")
    element.innerHTML = reportContainerElement?.innerHTML ?? ""

    // Display the report header and footer.
    element?.childNodes.forEach(
      (el) => ((el as HTMLElement).style.display = "initial")
    )

    // Add the dynamic element to the DOM
    document.body.appendChild(element)

    // Generate the PDF report
    if (isBrowser && element) {
      const { default: html2pdf } = await import("html2pdf.js")

      // Generation options
      const opt = {
        margin: 1,
        filename: "reporte_tropipay.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      }

      setLoading(true)

      // Generate and download the PDF
      html2pdf().from(element).set(opt).save()
      element.remove()

      setLoading(false)
    } else {
      console.error(
        "No es posible generar el archivo PDF: Elemento no encontrado."
      )
    }
  }

  /**
   * Handles the change of the date range for the report.
   * @param {string} value - The new date range value.
   * @returns {void}
   */
  const handleChangeRangeDate = (value: string) => {
    console.log(`Reload report data for range ${value}`)
  }

  return (
    <div>
      <div className="space-y-4">
        <InformationToolbar
          {...{
            handleDownload,
            handleChangeRangeDate,
            downloadButtonDisabled: loading,
          }}
        />

        <div className="report-container">
          <ReportHeader className="hidden" />
          <div className="pb-4">
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
          <ReportFooter className="hidden" />
        </div>
      </div>
    </div>
  )
}

export default PageClient
