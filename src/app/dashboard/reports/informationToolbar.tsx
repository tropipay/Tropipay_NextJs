import { ReportFilterDate } from "@/components/reports/ReportFilterDate"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface InformationToolbarProps {
  onDownload?: () => void
  onChangeRangeDate?: (value: string) => void
  downloadButtonDisabled?: boolean
}

export default function InformationToolbar({
  downloadButtonDisabled = false,
  onDownload,
  onChangeRangeDate,
}: InformationToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <ReportFilterDate {...{ onChange: onChangeRangeDate }} />
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
