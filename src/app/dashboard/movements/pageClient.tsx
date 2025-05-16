"use client"

import { useTranslation } from "@/components/intl/useTranslation"
import MovementDetailContainer from "@/components/movements/MovementDetailContainer"
import MovementDownloadDialog from "@/components/movements/MovementDownloadModal"
import DataTable from "@/components/table/DataTable"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui"
import { env } from "@/config/env"
import { GetMovementsResponse } from "@/types/movements"
import { fetchHeaders, getUrlSearchData } from "@/utils/data/utils"
import { toastMessage } from "@/utils/ui/utilsUI"
import { callPostHog } from "@/utils/utils"
import axios, { AxiosError } from "axios"
import { format, parse } from "date-fns"
import { Download } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePostHog } from "posthog-js/react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { t } = useTranslation()
  const postHog = usePostHog()
  const { data: session } = useSession()
  const { id: userId, token } = session?.user

  const [open, setOpen] = useState<boolean>(false)

  const onDownloadButtonClick = () => setOpen(true)

  const onDownloadModalClose = () => setOpen(false)

  const onDownload = async (
    reportType: string,
    reportFormat: string,
    dateStart?: string,
    dateEnd?: string
  ) => {
    const queryParams = {
      reportType,
      format: reportFormat,
      ...(reportType === "FILTERED_MOVEMENTS" &&
        dateStart &&
        dateEnd && {
          dateStart: format(
            parse(dateStart, "dd/MM/yyyy", new Date()),
            "yyyy-MM-dd"
          ),
          dateEnd: format(
            parse(dateEnd, "dd/MM/yyyy", new Date()),
            "yyyy-MM-dd"
          ),
        }),
    }

    try {
      const response = await axios(
        `${env.API_URL}/api/v3/movements/download?${getUrlSearchData(
          queryParams
        ).toString()}`,
        {
          headers: {
            ...fetchHeaders,
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => status >= 200 && status < 300,
        }
      )

      if (response.data.download === "OK") {
        toastMessage(t("download"), t("you_will_receive_email_transactions"))
        callPostHog(postHog, "movements:download", queryParams)
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e as AxiosError<any>
        toastMessage(t("download"), error.response?.data.error.message, "error")
      }
    }
  }

  const toolbarActions = (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onDownloadButtonClick}>
            <Download />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <FormattedMessage id="download" />
        </TooltipContent>
      </Tooltip>
      <MovementDownloadDialog
        {...{
          open,
          onClose: onDownloadModalClose,
          onDownload,
        }}
      />
    </>
  )

  return (
    <div className="w-full p-2">
      {userId && (
        <DataTable
          {...{
            tableId,
            userId,
            columns,
            data: data?.data?.movements?.items ?? [],
            rowCount: data?.data?.movements?.totalCount ?? 0,
            categoryFilterId: "movementDirection",
            categoryFilters: ["ALL", "IN", "OUT"],
            rowClickChildren: MovementDetailContainer,
            toolbarActions,
          }}
        />
      )}
    </div>
  )
}

export default PageClient
