"use client"

import { useTranslation } from "@/components/intl/useTranslation"
import MessageSonner from "@/components/MessageSonner"
import MovementDetailContainer from "@/components/movements/MovementDetailContainer"
import MovementDownloadDialog from "@/components/movements/MovementDownloadModal"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui"
import DataTable from "@/components/ui/table/DataTable"
import useStoreListener from "@/hooks/useStoreListener"
import BookingStore from "@/stores/BookingStore"
import ProfileStore from "@/stores/ProfileStore"
import { GetMovementsResponse } from "@/types/movements"
import { callPostHog } from "@/utils/utils"
import { format, parse } from "date-fns"
import { Download } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

interface Props {
  tableId: string
  columns: any
  data?: GetMovementsResponse
}

const PageClient = ({ tableId, columns, data }: Props) => {
  const { t } = useTranslation()
  const postHog = usePostHog()
  const userId = (ProfileStore?.getProfileData() as any)?.id

  const [open, setOpen] = useState<boolean>(false)
  const [messageData, setMessageData] = useState(null)

  const onDownloadButtonClick = () => setOpen(true)

  const onDownloadModalClose = () => setOpen(false)

  useStoreListener([
    {
      stores: [BookingStore],
      eventPrefix: "DOWNLOAD",
      actions: {
        DOWNLOAD_OK: () => {
          setMessageData({
            // @ts-ignore
            title: t("download"),
            message: t("you_will_receive_email_transactions"),
          })
          callPostHog(postHog, "movements:download", {})
        },
      },
      setMessageData,
    },
  ])

  const onDownload = (
    reportType: string,
    reportFormat: string,
    dateStart?: string,
    dateEnd?: string
  ) => {
    const filter = {
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

    BookingStore.Download(filter)
  }

  useEffect(() => {
    document.addEventListener("load", (e) => e.stopPropagation())
  }, [])

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
    <div className="w-full">
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

      <MessageSonner
        messageData={messageData}
        setMessageData={setMessageData}
      />
    </div>
  )
}

export default PageClient
