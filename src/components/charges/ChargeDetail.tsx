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
import { useEffect, useState } from "react"
import { useTranslations } from "@/utils/intl"
import { TextToCopy } from "../TextToCopy"
import { Countries } from "@/types/countries"
import { listenProcessError } from "@/utils/utils"
import DestinationCountryStore from "@/stores/DestinationCountryStore"

export default function ChargeDetail(props: any): JSX.Element {
  const [openRefundDialog, setOpenRefundDialog] = useState(false)
  const row: Charge = props.data.data.charges.items[0]
  const { data: session } = useSession()
  const token = session?.user.token

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

  const [countries, setCountries] = useState<Countries>([])

  const listener = (obj) => {
    const actions = {
      DESTINATION_COUNTRY_LIST_OK: (obj) => {
        setCountries(obj.payload.data)
        console.log("obj.payload.data:", obj.payload.data)
      },
    }
    actions[obj.type] && actions[obj.type](obj)
    listenProcessError(obj, actions, null)
  }

  useEffect(() => {
    const unsubscriberDestinationCountryStore = DestinationCountryStore.listen(
      listener,
      "MovementDetail"
    )
    DestinationCountryStore.List()
    return () => {
      unsubscriberDestinationCountryStore()
    }
  }, [])

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
          <RowDetailInfo label={t("movementCode")} value={reference} />
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
          <RowDetailInfo
            label={t("cardCountry")}
            value={
              countries.find((c) => c.slug === cardCountry)?.name || cardCountry
            }
          />
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
