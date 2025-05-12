"use client"

import {
  movementStateGroups,
  movementStates,
} from "@/app/filterDefinitions/movements"
import { RefundWizard } from "@/components/refund/RefundDialog/RefundWizard"
import FacetedBadge from "@/components/table/FacetedBadge"
import { RowDetailInfo } from "@/components/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/table/tableRowDetails/RowDetailSection"
import { Button } from "@/components/ui"
import { env } from "@/config/env"
import { MovementDetails } from "@/types/movements"
import { fetchHeaders, formatAmount } from "@/utils/data/utils"
import { callPostHog } from "@/utils/utils"
import axios from "axios"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { usePostHog } from "posthog-js/react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
export default function MovementDetail(props: any): JSX.Element {
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const row: MovementDetails = props.data.data.movements.items[0]
  const { data: session } = useSession()
  const token = session?.user.token
  const postHog = usePostHog()
  const {
    email,
    fee,
    createdAt,
    completedAt,
    paymentMethod,
    amount,
    cardPan,
    product,
    conversionRate,
    concept,
    bankOrderCode,
    state,
    movementDetail: {
      cardCountry,
      cardExpirationDate,
      cardType,
      clientAddress,
      clientIp,
      netAmount,
      refundable,
      recipientData: { alias, name, account, country },
      senderData: {
        name: senderName,
        lastName: senderLastName,
        email: senderEmail,
        country: senderCountry,
      },
      type,
    },
  } = row

  const onDownloadInvoiceFile = async () => {
    callPostHog(postHog, "download_invoice_clicked")
    try {
      const response = await axios.post(
        `${env.API_URL}/api/v3/movements/transferinvoice`,
        JSON.stringify({
          bookingId: row.id,
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
    <div className="max-w-md mx-auto p-4">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
            {amount.value > 0 ? "+" : ""}
            {formatAmount(amount.value, amount.currency, "right")}
          </div>
          <FacetedBadge
            value={state}
            optionList={movementStates}
            optionListGroups={movementStateGroups}
          />
        </div>
        <div className="flex justify-between items-center mb-4 pb-1">
          <p className="text-xs text-gray-500"> {bankOrderCode}</p>
          {completedAt && (
            <p className="text-xs text-gray-500">
              {format(new Date(completedAt), "dd/MM/yy HH:mm")}
            </p>
          )}
        </div>
        <RowDetailSection title={<FormattedMessage id="movement_data" />}>
          <RowDetailInfo
            label={<FormattedMessage id="type" />}
            value={<FormattedMessage id={`mt_${type}`} />}
          />
          {product && (
            <RowDetailInfo
              label={<FormattedMessage id="product" />}
              value={<FormattedMessage id={`cp_${product}`} />}
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="concept" />}
            value={concept}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="beneficiary_data" />}>
          <RowDetailInfo
            label={<FormattedMessage id="alias" />}
            value={alias}
          />
          {name && (
            <RowDetailInfo
              label={<FormattedMessage id="name" />}
              value={<span className="uppercase">{name}</span>}
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="account" />}
            value={account}
          />
          <RowDetailInfo
            label={<FormattedMessage id="email" />}
            value={email}
          />
          <RowDetailInfo
            label={<FormattedMessage id="country" />}
            value={country}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="sender_data" />}>
          {senderName && (
            <RowDetailInfo
              label={<FormattedMessage id="name" />}
              value={
                <span className="uppercase">{`${senderName} ${senderLastName}`}</span>
              }
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="email" />}
            value={senderEmail}
          />
          <RowDetailInfo
            label={<FormattedMessage id="address" />}
            value={clientAddress}
          />
          <RowDetailInfo
            label={<FormattedMessage id="country" />}
            value={senderCountry}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="imports" />}>
          <RowDetailInfo
            label={<FormattedMessage id="import" />}
            value={formatAmount(amount.value, amount.currency, "right")}
          />
          {conversionRate && fee && amount.currency !== fee.currency && (
            <RowDetailInfo
              label={<FormattedMessage id="conversionRate" />}
              value={`1 EUR = ${conversionRate} ${amount.currency}`}
            />
          )}
          {fee && (
            <RowDetailInfo
              label={<FormattedMessage id="fee" />}
              value={formatAmount(fee.value, fee.currency, "right")}
            />
          )}
          <RowDetailInfo
            label={<FormattedMessage id="netAmount" />}
            value={`${formatAmount(
              netAmount.value,
              netAmount.currency,
              "right"
            )}`}
          />
        </RowDetailSection>

        <RowDetailSection title={<FormattedMessage id="payment_method" />}>
          <RowDetailInfo
            label={<FormattedMessage id="cardType" />}
            value={cardType}
          />
          {/* <Info
            label={<FormattedMessage id="account" />}
            value="******** FALTA CUENTA"
          /> */}
          <RowDetailInfo
            label={<FormattedMessage id="paymentMethod" />}
            value={<FormattedMessage id={`pm_${paymentMethod}`} />}
          />
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
              value={format(new Date(createdAt), "dd/MM/yy")}
            />
          )}
          {completedAt && (
            <RowDetailInfo
              label={<FormattedMessage id="completedAt" />}
              value={format(new Date(completedAt), "dd/MM/yy")}
            />
          )}
        </RowDetailSection>
      </div>
      <div className="flex mt-4 gap-4 w-full p-4 bg-white absolute bottom-0 left-0">
        <Button
          variant="outline"
          className={`${refundable ? "w-1/2" : "w-full"}`}
          onClick={onDownloadInvoiceFile}
        >
          <FormattedMessage id="download" />
        </Button>
        {refundable && (
          <Button
            variant="default"
            className="w-1/2"
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
          orderCode={bankOrderCode}
        />
      </div>
    </div>
  )
}
