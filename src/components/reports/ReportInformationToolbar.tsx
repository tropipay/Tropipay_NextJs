import { ReportFilterDate } from "@/components/reports/ReportFilterDate"
import { Button } from "@/components/ui"
import { DownloadIcon } from "lucide-react"

interface InformationToolbarProps {
  startDate: string
  endDate: string
  onDownload?: () => void
  onChangeRangeDate?: (value: string) => void
  downloadButtonDisabled?: boolean
}

export default function ReportInformationToolbar({
  startDate,
  endDate,
  downloadButtonDisabled = false,
  onDownload,
  onChangeRangeDate,
}: InformationToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <ReportFilterDate
          {...{
            defaultStartDate: startDate,
            defaultEndDate: endDate,
            onChange: onChangeRangeDate,
          }}
        />
      </div>

      <Button
        disabled={downloadButtonDisabled}
        variant="outline"
        size="icon"
        onClick={onDownload}
      >
        <DownloadIcon size={16} />
      </Button>
    </div>
  )
}
