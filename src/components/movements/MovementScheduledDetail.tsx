import {
  movementScheduledStates,
  movementStateGroups,
} from "@/app/filterDefinitions/movements"
import ErrorMessage from "@/components/ErrorMessage"
import FacetedBadge from "@/components/table/FacetedBadge"
import { RowDetailInfo } from "@/components/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/table/tableRowDetails/RowDetailSection"
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
import { MovementScheduled } from "@/types/movements"
import { processEnvNEXT_PUBLIC_API_URL } from "@/utils/config"
import { fetchHeaders, formatAmount } from "@/utils/data/utils"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

export default function MovementScheduledDetail(props: any): JSX.Element {
  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const token = session?.user.token

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

  const onCancel = async () => {
    setIsError(false)
    setIsLoading(true)
    try {
      const res = await fetch(
        `${processEnvNEXT_PUBLIC_API_URL}/api/v3/scheduled_transaction/${id}/deactivate`,
        {
          method: "PUT",
          headers: {
            ...fetchHeaders,
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
      }

      setIsDone(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const onDone = () => {
    setOpenModalConfirm(false)
    window.location.reload()
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
              {originAmount > 0 ? "+" : ""}
              {formatAmount(originAmount, currency, "right")}
            </div>
            <FacetedBadge
              value={state}
              optionList={movementScheduledStates}
              optionListGroups={movementStateGroups}
            />
          </div>
          <div className="flex justify-between items-center mb-4 pb-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FormattedMessage id="send_to" />
              <span className="capitalize">{alias}</span>
            </p>
            {nextDate && (
              <p className="text-xs text-gray-500">
                {format(new Date(nextDate), "dd/MM/yy HH:mm")}
              </p>
            )}
          </div>
          <RowDetailSection title={<FormattedMessage id="client_data" />}>
            <RowDetailInfo
              label={<FormattedMessage id="beneficiary" />}
              value={<span className="capitalize">{alias}</span>}
            />
            <RowDetailInfo
              label={<FormattedMessage id="destiny_account" />}
              value={accountNumber}
            />
            <RowDetailInfo
              label={<FormattedMessage id="concept" />}
              value={conceptTransfer}
            />
          </RowDetailSection>

          <RowDetailSection title={<FormattedMessage id="payment_details" />}>
            <></>
            {/* <Info
          label={<FormattedMessage id="amount" />}
          value={formatAmount(originAmount, currency, "right")}
        /> */}
            {/* <Info
          label={<FormattedMessage id="paymentMethod" />}
          value={<FormattedMessage id={`pm_${paymentMethod}`} />}
        />
        {cardBin && (
          <Info
            label={<FormattedMessage id="cardPan" />}
            value={`${cardBin} **** `}
          />
        )} */}
          </RowDetailSection>

          <RowDetailSection title={<FormattedMessage id="schedule" />}>
            {createdAt && (
              <RowDetailInfo
                label={<FormattedMessage id="createdAt" />}
                value={format(new Date(createdAt), "dd/MM/yy")}
              />
            )}
            {nextDate && (
              <RowDetailInfo
                label={<FormattedMessage id="date_to_pay" />}
                value={format(new Date(nextDate), "dd/MM/yy")}
              />
            )}
            {frecuency && (
              <RowDetailInfo
                label={<FormattedMessage id="recurrence" />}
                value={<FormattedMessage id={`mr_${frecuency}`} />}
              />
            )}
          </RowDetailSection>
        </div>
        {!isDone && (
          <div className="flex mt-4 gap-4 w-full p-4 bg-white absolute bottom-0 left-0">
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                setIsError(false)
                setIsDone(false)
                setIsLoading(false)
                setOpenModalConfirm(true)
              }}
            >
              <FormattedMessage id="cancel_scheduled" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={openModalConfirm} onOpenChange={setOpenModalConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <FormattedMessage
                id={isDone ? "transfer_cancelled" : "cancel_movement_sched"}
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              <FormattedMessage
                id={
                  isDone
                    ? "transfer_cancelled_desc"
                    : "cancel_movement_sched_desc"
                }
              />
            </AlertDialogDescription>
            {isError && (
              <ErrorMessage>
                <FormattedMessage id="error_execute_operation" />
              </ErrorMessage>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isDone ? (
              <AlertDialogAction onClick={onDone}>
                <FormattedMessage id="ready" />
              </AlertDialogAction>
            ) : (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => setOpenModalConfirm(false)}
                >
                  <FormattedMessage id="cancel" />
                </Button>
                <Button variant={"default"} onClick={onCancel}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  <FormattedMessage id="cancel_scheduled" />
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
