import {
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import FacetedBadge from "@/components/table/FacetedBadge"
import { RowDetailInfo } from "@/components/table/tableRowDetails/RowDetailInfo"
import { RowDetailSection } from "@/components/table/tableRowDetails/RowDetailSection"
import { Charge } from "@/types/charges"
import { processEnvNEXT_PUBLIC_API_URL } from "@/utils/config"
import { fetchHeaders, formatAmount } from "@/utils/data/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { FormattedMessage } from "react-intl"

export default function ChargeDetail(props: any): JSX.Element {
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
  } = row

  const onDownloadInvoiceFile = async () => {
    try {
      const response = await fetch(
        `${processEnvNEXT_PUBLIC_API_URL}/api/v3/movements/transferinvoice`,
        {
          method: "POST",
          headers: {
            ...fetchHeaders,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: row.id,
            label: row.state,
          }),
        }
      )
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = "invoice.pdf"
      link.click()
    } catch (e) {}
  }

  const onDownload = () => {
    console.log("Coming soon!")
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
            optionList={chargeStates}
            optionListGroups={chargeStatesGroups}
          />
        </div>
        <div className="flex justify-between items-center mb-4 pb-1">
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
            label={<FormattedMessage id="reference" />}
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

      {/* <div className="flex mt-4 gap-4 w-full p-4 bg-white absolute bottom-0 left-0">
        <Button
          variant="outline"
          className="w-full md:w-1/2"
          onClick={onDownload}
        >
          <Download />
          <FormattedMessage id="download" />
        </Button>
        <Button variant="default" className="w-full md:w-1/2">
          <FormattedMessage id="refound" />
        </Button>
      </div> */}
    </div>
  )
}
