import {
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { RefundWizard } from "@/components/refund/RefundDialog/RefundWizard"
import FacetedBadge from "@/components/table/FacetedBadge"
import { RowDetailInfo } from "@/components/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/table/tableRowDetails/RowDetailSection"
import { Button } from "@/components/ui"
import { Charge } from "@/types/charges"
import { formatAmount } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { format } from "date-fns"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { TextToCopy } from "../TextToCopy"

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
    reference,
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
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {t("charge_to")}
            <span className="uppercase">
              <TextToCopy value={fullName} className="p-1" />
            </span>
          </p>
          {completedAt && (
            <p className="text-xs text-gray-500">
              <TextToCopy
                value={format(new Date(completedAt), "dd/MM/yy HH:mm")}
                className="p-1"
              />
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <RowDetailSection title={t("payment_details")}>
          <RowDetailInfo
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
            label={t("movementCode")}
            value={reference}
            onValueClick={() => props.onChangeMovementId?.(movementId)}
            valueTooltip={<FormattedMessage id="show_movement" />}
          />
          <RowDetailInfo label={t("errorCode")} value={errorCode} />
        </RowDetailSection>

        <RowDetailSection title={t("client_data")}>
          <RowDetailInfo
            label={t("fullName")}
            value={<span className="uppercase">{fullName}</span>}
          />
          <RowDetailInfo label={t("email")} value={email} />
          <RowDetailInfo label={t("address")} value={address} />
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
          <RowDetailInfo label={t("clientIp")} value={clientIp} />
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
