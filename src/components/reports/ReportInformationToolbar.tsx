import { ReportFilterDate } from "@/components/reports/ReportFilterDate"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui"
import { Download } from "lucide-react"
import { FormattedMessage } from "react-intl"

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

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={downloadButtonDisabled}
            variant="outline"
            onClick={onDownload}
          >
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <FormattedMessage id="download" />
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
