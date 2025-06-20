import {
  movementScheduledStates,
  movementStateGroups,
} from "@/app/filterDefinitions/movements"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@/components/ui"
import FacetedBadge from "@/components/ui/table/FacetedBadge"
import { RowDetailInfo } from "@/components/ui/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/ui/table/tableRowDetails/RowDetailSection"
import useStoreListener from "@/hooks/useStoreListener"
import BookingStore from "@/stores/BookingStore"
import { MovementScheduled } from "@/types/movements"
import { formatAmount } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { TextToCopy } from "../copyToClipboard/TextToCopy"
import MessageSonner from "../MessageSonner"

export default function MovementScheduledDetail(props: any): JSX.Element {
  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messageData, setMessageData] = useState(null)

  const row: MovementScheduled = props.data
  const {
    id,
    createdAt,
    originAmount,
    currency,
    depositaccount: { alias, accountNumber },
    nextDate,
    frecuency,
    conceptTransfer,
    state,
  } = row

  const { t } = useTranslations()
  useStoreListener([
    {
      stores: [BookingStore],
      eventPrefix: "MovementScheduledDetail",
      actions: {
        DEACTIVATE_SCHEDULED_TRANSACTION_OK: (obj) => {
          setIsDone(true)
          setIsLoading(false)
        },
      },
      setMessageData,
    },
  ])

  const onDone = () => {
    setOpenModalConfirm(false)
    window.location.reload()
  }

  const onCancel = () => {
    BookingStore.DeactivateScheduled({ id })
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mt-1">
            <div className="font-poppins md:text-2xl leading-5 tracking-tight uppercase font-bold">
              <TextToCopy
                classNameIcon={"hidden"}
                value={`${originAmount > 0 ? "+" : ""}${formatAmount(
                  originAmount,
                  currency,
                  "right"
                )}`}
              />
            </div>
            <FacetedBadge
              value={state}
              optionList={movementScheduledStates}
              optionListGroups={movementStateGroups}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <TextToCopy
                classNameIcon={"hidden"}
                value={t("send_to") + " " + alias}
                className="p-1"
              />
            </span>
            {nextDate && (
              <span className="text-xs text-gray-500">
                {format(new Date(nextDate), "dd/MM/yy HH:mm")}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <RowDetailSection title={t("client_data")}>
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("beneficiary")}
              value={<span className="capitalize">{alias}</span>}
              textToCopy={alias}
            />
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("destiny_account")}
              value={accountNumber}
            />
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("concept")}
              value={conceptTransfer}
            />
          </RowDetailSection>

          {/* <RowDetailSection title={t("payment_details")}>
            <Info
          label={t(amount" />}
          value={formatAmount(originAmount, currency, "right")}
        /> <Info
          label={t(paymentMethod" />}
          value={t(`pm_${paymentMethod}`} />}
        />
        {cardBin && (
          <Info
            label={t(cardPan" />}
            value={`${cardBin} **** `}
          />
        )}
          </RowDetailSection>  */}

          <RowDetailSection title={t("schedule")}>
            {createdAt && (
              <RowDetailInfo
                label={t("createdAt")}
                value={format(new Date(createdAt), "dd/MM/yy")}
              />
            )}
            {nextDate && (
              <RowDetailInfo
                label={t("date_to_pay")}
                value={format(new Date(nextDate), "dd/MM/yy")}
              />
            )}
            {frecuency && (
              <RowDetailInfo
                label={t("recurrence")}
                value={t(`mr_${frecuency}`)}
              />
            )}
          </RowDetailSection>
        </div>
        {!isDone && (
          <div className="flex gap-4 border-t border-gray-200 mt-4 pt-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                setIsDone(false)
                setIsLoading(false)
                setOpenModalConfirm(true)
              }}
            >
              {t("cancel_scheduled")}
            </Button>
          </div>
        )}
      </div>
      {/* <ErrorHandler messageData={messageData} /> */}
      <AlertDialog open={openModalConfirm} onOpenChange={setOpenModalConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(isDone ? "transfer_cancelled" : "cancel_movement_sched")}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {t(
                isDone
                  ? "transfer_cancelled_desc"
                  : "cancel_movement_sched_desc"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isDone ? (
              <AlertDialogAction onClick={onDone}>
                {t("ready")}
              </AlertDialogAction>
            ) : (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setMessageData(null)
                    setOpenModalConfirm(false)
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button variant={"default"} onClick={onCancel}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  {t("cancel_scheduled")}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <MessageSonner
        messageData={messageData}
        setMessageData={setMessageData}
      />
    </>
  )
}
