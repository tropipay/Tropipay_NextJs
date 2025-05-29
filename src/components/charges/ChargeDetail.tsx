import {
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { RefundWizard } from "@/components/refund/RefundDialog/RefundWizard"
import FacetedBadge from "@/components/table/FacetedBadge"
import { RowDetailInfo } from "@/components/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/table/tableRowDetails/RowDetailSection"
import { Button } from "@/components/ui"
import { env } from "@/config/env"
import { Charge } from "@/types/charges"
import { fetchHeaders, formatAmount } from "@/utils/data/utils"
import axios from "axios"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

export default function ChargeDetail(props: any): JSX.Element {
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const row: Charge = props.data.data.charges.items[0]
  const { data: session } = useSession()
  const token = session?.user.token

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

  const onDownloadInvoiceFile = async () => {
    try {
      const response = await axios.post(
        `${env.API_URL}/api/v3/movements/transferinvoice`,
        JSON.stringify({
          bookingId: movementId,
          label: row.state,
        }),
        {
          headers: {
            ...fetchHeaders,
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
          validateStatus: (status) => status >= 200 && status < 300,
        }
      )
      const blob = await response.data
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = "invoice.pdf"
      link.click()
    } catch (e) {}
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-poppins md:text-2xl leading-5 tracking-tight uppercase font-bold">
            {amount.value > 0 ? "+" : ""}
            {formatAmount(amount.value, amount.currency, "right")}
          </div>
          <FacetedBadge
            value={state}
            optionList={chargeStates}
            optionListGroups={chargeStatesGroups}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FormattedMessage id="charge_to" />
            <span className="uppercase">{fullName}</span>
          </p>
          {completedAt && (
            <p className="text-xs text-gray-500">
              {format(new Date(completedAt), "dd/MM/yy HH:mm")}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <RowDetailSection title={<FormattedMessage id="payment_details" />}>
          <RowDetailInfo
            label={<FormattedMessage id="amount" />}
            value={formatAmount(amount.value, amount.currency, "right")}
          />
          <RowDetailInfo
            label={<FormattedMessage id="paymentMethod" />}
            value={<FormattedMessage id={`pm_${paymentMethod}`} />}
          />
          {cardBin && (
            <RowDetailInfo
              label={<FormattedMessage id="cardBin" />}
              value={`${cardBin} **** `}
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="movementCode" />}
            value={reference}
          />
          <RowDetailInfo
            label={<FormattedMessage id="errorCode" />}
            value={errorCode}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="client_data" />}>
          <RowDetailInfo
            label={<FormattedMessage id="fullName" />}
            value={<span className="uppercase">{fullName}</span>}
          />
          <RowDetailInfo
            label={<FormattedMessage id="email" />}
            value={email}
          />
          <RowDetailInfo
            label={<FormattedMessage id="address" />}
            value={address}
          />
          <RowDetailInfo
            label={<FormattedMessage id="country" />}
            value={country}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="payment_method" />}>
          {cardPan && (
            <RowDetailInfo
              label={<FormattedMessage id="cardPan" />}
              value={`**** ${cardPan}`}
            />
          )}
          {cardExpirationDate && (
            <RowDetailInfo
              label={<FormattedMessage id="cardExpirationDate" />}
              value={format(cardExpirationDate, "dd/MM/yy")}
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="cardCountry" />}
            value={cardCountry}
          />
          <RowDetailInfo
            label={<FormattedMessage id="clientIp" />}
            value={clientIp}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="schedule" />}>
          {createdAt && (
            <RowDetailInfo
              label={<FormattedMessage id="createdAt" />}
              value={createdAt && format(new Date(createdAt), "dd/MM/yy")}
            />
          )}
          {completedAt && (
            <RowDetailInfo
              label={<FormattedMessage id="completedAt" />}
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
            <FormattedMessage id="refund" />
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
