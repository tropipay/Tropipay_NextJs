import InformationToolbar from "@/app/dashboard/reports/informationToolbar"
import ReportFooter from "@/components/reports/ReportFooter"
import ReportHeader from "@/components/reports/ReportHeader"
import { RowData } from "@/components/rowData/RowData"
import { BalanceSummaryResponse } from "@/types/reports/balanceSummary/balanceSummaryResponse"
import { formatAmount } from "@/utils/data/utils"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

interface Props {
  startDate: string
  endDate: string
  data?: BalanceSummaryResponse
  onChangeRangeDate?: (value: string) => void
}

export default function ReportBalanceSummary({
  data,
  startDate,
  endDate,
  onChangeRangeDate,
}: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const isBrowser = typeof window !== undefined

  /**
   * Handles the download of the report as a PDF.
   * @async
   */
  const onDownload = async () => {
    // Get the HTML element for generation
    const reportContainerElement = document.querySelector(".report-container")

    // Create a dynamic element and pass HTML content to it
    const element = document.createElement("div")
    element.innerHTML = reportContainerElement?.innerHTML ?? ""

    // Display the report header and footer.
    element?.childNodes.forEach(
      (el) => ((el as HTMLElement).style.display = "initial")
    )

    // Adjusting report style to a page
    element?.querySelectorAll(".report-content-row").forEach((el) => {
      el.classList.remove("report-content-row", "p-5")
      el.classList.add("pt-0", "pb-[13px]", "px-4")
    })

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
      html2pdf().from(element).set(opt).toPdf().save()
      element.remove()

      setLoading(false)
    } else {
      console.error(
        "No es posible generar el archivo PDF: Elemento no encontrado."
      )
    }
  }

  return data ? (
    <div className="space-y-4">
      <InformationToolbar
        {...{
          onDownload,
          onChangeRangeDate,
          downloadButtonDisabled: loading,
        }}
      />

      <div className="report-container">
        <ReportHeader className="hidden" {...{ startDate, endDate }} />
        <div className="my-4">
          {/* Summary */}
          <RowData
            label={<FormattedMessage id="balance_summary" />}
            value={<FormattedMessage id="amount" />}
            style="header"
          />
          {["initialBalance", "sales", "refunds", "commissions"].map(
            (value) => (
              <RowData
                key={`summary.${value}`}
                label={<FormattedMessage id={value} />}
                value={formatAmount(data.summary[value], "EUR", "right")}
                style="row"
              />
            )
          )}

          <RowData
            label={<FormattedMessage id="net" />}
            value={formatAmount(data.summary.net, "EUR", "right")}
            style="resume"
          />

          {/* Commissions */}
          <RowData
            label={<FormattedMessage id="commissions" />}
            value={""}
            style="header"
          />
          {["cardCollection", "internalTransfers", "externalTransfers"].map(
            (value) => (
              <RowData
                key={`commissions.${value}`}
                label={<FormattedMessage id={value} />}
                value={formatAmount(data.commissions[value], "EUR", "right")}
                style="row"
              />
            )
          )}
          <RowData
            label={<FormattedMessage id="total" />}
            value={formatAmount(data.commissions.total, "EUR", "right")}
            style="resume"
          />

          <RowData
            label={<FormattedMessage id="shipments" />}
            value={""}
            style="header"
          />

          {/* shipments */}
          <RowData
            label={<FormattedMessage id="shipments" />}
            value={formatAmount(data.shipments.totalShipments, "EUR", "right")}
            style="row"
          />
          <RowData
            label={<FormattedMessage id="total" />}
            value={formatAmount(data.shipments.totalShipments, "EUR", "right")}
            style="resume"
          />
          <RowData
            label={<FormattedMessage id="balance" />}
            value={""}
            style="row"
          />
          <RowData
            label={<FormattedMessage id="available_balance" />}
            value={formatAmount(data.balance.finalBalance, "EUR", "right")}
            style="resume"
          />
        </div>
        <ReportFooter className="hidden" />
      </div>
    </div>
  ) : (
    <></>
  )
}
