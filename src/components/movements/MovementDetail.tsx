"use client"

import {
  movementStateGroups,
  movementStates,
} from "@/app/filterDefinitions/movements"
import { RefundWizard } from "@/components/refund/RefundDialog/RefundWizard"
import { Button } from "@/components/ui"
import FacetedBadge from "@/components/ui/table/FacetedBadge"
import { RowDetailInfo } from "@/components/ui/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/ui/table/tableRowDetails/RowDetailSection"
import useStoreListener from "@/hooks/useStoreListener"
import BookingStore from "@/stores/BookingStore"
import { MovementDetails } from "@/types/movements"
import { formatAmount } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { callPostHog } from "@/utils/utils"
import { format } from "date-fns"
import { usePostHog } from "posthog-js/react"
import { useState } from "react"
import { TextToCopy } from "../copyToClipboard/TextToCopy"
import MessageSonner from "../MessageSonner"

export default function MovementDetail(props: any): JSX.Element {
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const row: MovementDetails = props.data.data.movements.items[0]
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
      chargedAmount,
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

  const [messageData, setMessageData] = useState(null)

  const { t } = useTranslations()

  const handleDownloadSuccess = (obj: any) => {
    const blob = obj.data
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = "invoice.pdf"
    link.click()
  }

  useStoreListener([
    {
      stores: [BookingStore],
      eventPrefix: "DOWNLOAD_PDF",
      actions: {
        DOWNLOAD_PDF_OK: handleDownloadSuccess,
      },
      setMessageData,
    },
  ])

  const onDownloadInvoiceFile = () => {
    callPostHog(postHog, "movements:download_invoice_file")
    BookingStore.DownloadPDF({
      bookingId: row.id,
      label: row.state,
    })
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mt-1">
          <div className="font-poppins md:text-2xl leading-5 tracking-tight uppercase font-bold">
            <TextToCopy
              classNameIcon={"hidden"}
              value={`${netAmount.value > 0 ? "+" : ""}${formatAmount(
                netAmount.value,
                netAmount.currency,
                "right"
              )}`}
            />
          </div>
          <FacetedBadge
            value={state}
            optionList={movementStates}
            optionListGroups={movementStateGroups}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            <TextToCopy
              classNameIcon={"hidden"}
              value={bankOrderCode}
              className="p-1"
            />
          </p>
          {completedAt && (
            <p className="text-xs text-gray-500">
              {format(new Date(completedAt), "dd/MM/yy HH:mm")}
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <RowDetailSection title={t("movement_data")}>
          <RowDetailInfo label={t("type")} value={t(`mt_${type}`)} />
          {product && (
            <RowDetailInfo label={t("product")} value={t(`cp_${product}`)} />
          )}
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("concept")}
            value={concept}
          />
        </RowDetailSection>

        <RowDetailSection title={t("beneficiary_data")}>
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("alias")}
            value={alias}
          />
          {name && (
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("name")}
              value={<span className="capitalize">{name}</span>}
            />
          )}
          <RowDetailInfo label={t("account")} value={account} />
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("email")}
            value={email}
          />
          <RowDetailInfo label={t("country")} value={country} />
        </RowDetailSection>

        <RowDetailSection title={t("sender_data")}>
          {senderName && (
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("name")}
              value={
                <span className="capitalize">{`${senderName} ${senderLastName}`}</span>
              }
            />
          )}
          <RowDetailInfo toClipboard label={t("email")} value={senderEmail} />
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("address")}
            value={clientAddress}
          />
          <RowDetailInfo label={t("country")} value={senderCountry} />
        </RowDetailSection>

        <RowDetailSection title={t("imports")}>
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("amountCharged")}
            value={formatAmount(
              chargedAmount.value,
              chargedAmount.currency,
              "right"
            )}
          />
          {conversionRate && fee && amount.currency !== fee.currency && (
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("conversionRate")}
              value={`1 EUR = ${conversionRate} ${amount.currency}`}
            />
          )}
          {fee && (
            <RowDetailInfo
              toClipboard
              toClipboardIconHidden
              label={t("fee")}
              value={formatAmount(fee.value, fee.currency, "right")}
            />
          )}
          <RowDetailInfo
            toClipboard
            toClipboardIconHidden
            label={t("netAmount")}
            value={`${formatAmount(
              netAmount.value,
              netAmount.currency,
              "right"
            )}`}
          />
        </RowDetailSection>

        <RowDetailSection title={t("payment_method")}>
          <RowDetailInfo label={t("cardType")} value={cardType} />

          <RowDetailInfo
            label={t("paymentMethod")}
            value={t(`pm_${paymentMethod}`)}
          />
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
              value={format(new Date(createdAt), "dd/MM/yy")}
            />
          )}
          {completedAt && (
            <RowDetailInfo
              label={t("completedAt")}
              value={format(new Date(completedAt), "dd/MM/yy")}
            />
          )}
        </RowDetailSection>
      </div>
      <div className="flex gap-4 border-t border-gray-200 mt-4 pt-4">
        <Button
          variant="outline"
          className={refundable ? "w-1/2" : "w-full"}
          onClick={onDownloadInvoiceFile}
        >
          {t("download")}
        </Button>
        {refundable && (
          <Button
            variant="default"
            className="w-1/2"
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
          orderCode={bankOrderCode}
        />
      </div>
      <MessageSonner
        messageData={messageData}
        setMessageData={setMessageData}
      />
    </div>
  )
}
