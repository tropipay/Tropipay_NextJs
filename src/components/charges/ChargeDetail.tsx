import {
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { RefundWizard } from "@/components/refund/RefundDialog/RefundWizard"
import { Button } from "@/components/ui"
import FacetedBadge from "@/components/ui/table/FacetedBadge"
import { RowDetailInfo } from "@/components/ui/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/ui/table/tableRowDetails/RowDetailSection"
import { Charge } from "@/types/charges"
import { formatAmount } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { format } from "date-fns"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { TextToCopy } from "../copyToClipboard/TextToCopy"

export default function ChargeDetail(props: any): JSX.Element {
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const row: Charge = props.data.data.charges.items[0]

  const { t } = useTranslations()
  const {
    amount,
    state,
    createdAt,
    completedAt,
    fullName,
    paymentMethod,
    cardBin,
    cardPan,
    bankOrderCode,
    errorCode,
    email,
    address,
    country,
    cardExpirationDate,
    cardCountry,
    clientIp,
    refundable,
    movementId,
  } = row

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-poppins md:text-2xl leading-5 tracking-tight uppercase font-bold">
            <TextToCopy
              classNameIcon={"hidden"}
              value={`${amount.value > 0 ? "+" : ""}${formatAmount(
                amount.value,
                amount.currency,
                "right"
              )}`}
            />
          </div>
          <FacetedBadge
            value={state}
            optionList={chargeStates}
            optionListGroups={chargeStatesGroups}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            {t("charge_to")}
            <span className="capitalize">
              <TextToCopy
                classNameIcon={"hidden"}
                value={fullName}
                className="p-1"
              />
            </span>
          </span>
          {completedAt && (
            <span className="text-xs text-gray-500">
              {format(new Date(completedAt), "dd/MM/yy HH:mm")}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <RowDetailSection title={t("payment_details")}>
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("amount")}
            value={formatAmount(amount.value, amount.currency, "right")}
          />
          <RowDetailInfo
            label={t("paymentMethod")}
            value={t(`pm_${paymentMethod}`)}
          />
          {cardBin && (
            <RowDetailInfo label={t("cardBin")} value={`${cardBin} **** `} />
          )}
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("movementCode")}
            value={bankOrderCode}
            onValueClick={() => props.onChangeMovementId?.(movementId)}
            toolTipForValue={<FormattedMessage id="show_movement" />}
            classNameForValue={"text-primary underline"}
          />
          <RowDetailInfo label={t("errorCode")} value={errorCode} />
        </RowDetailSection>

        <RowDetailSection title={t("client_data")}>
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("fullName")}
            value={<span className="capitalize">{fullName}</span>}
          />
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("email")}
            value={email}
          />
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("address")}
            value={address}
          />
          <RowDetailInfo label={t("country")} value={country} />
        </RowDetailSection>

        <RowDetailSection title={t("payment_method")}>
          {cardPan && (
            <RowDetailInfo label={t("cardPan")} value={`**** ${cardPan}`} />
          )}
          {cardExpirationDate && (
            <RowDetailInfo
              label={t("cardExpirationDate")}
              value={format(cardExpirationDate, "dd/MM/yy")}
            />
          )}
          <RowDetailInfo label={t("cardCountry")} value={cardCountry} />
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("clientIp")}
            value={clientIp}
          />
        </RowDetailSection>

        <RowDetailSection title={t("schedule")}>
          {createdAt && (
            <RowDetailInfo
              label={t("createdAt")}
              value={createdAt && format(new Date(createdAt), "dd/MM/yy")}
            />
          )}
          {completedAt && (
            <RowDetailInfo
              label={t("completedAt")}
              value={completedAt && format(new Date(completedAt), "dd/MM/yy")}
            />
          )}
        </RowDetailSection>
      </div>
      <div className="flex gap-4">
        {refundable && (
          <Button
            variant="default"
            className="w-full"
            onClick={() => setOpenRefundDialog(true)}
          >
            {t("refund")}
          </Button>
        )}
        <RefundWizard
          open={openRefundDialog}
          onOpenChange={setOpenRefundDialog}
          amountValue={amount.value}
          amountCurrency={amount.currency}
          orderCode={movementId}
        />
      </div>
    </div>
  )
}
