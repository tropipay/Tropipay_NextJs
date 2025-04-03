import {
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { Info } from "@/components/sectionComponents/info"
import { Section } from "@/components/sectionComponents/section"
import FacetedBadge from "@/components/table/facetedBadge"
import { Button } from "@/components/ui/button"
import { fetchHeaders, formatAmount } from "@/lib/utils"
import { format } from "date-fns"
import { Download } from "lucide-react"
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v3/movements/transferinvoice`,
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
        <p className="text-xs text-gray-500">
          <FormattedMessage id="charge_to" /> {fullName}
        </p>
        {completedAt && (
          <p className="text-xs text-gray-500">
            {format(new Date(completedAt), "dd/MM/yy HH:mm")}
          </p>
        )}
      </div>
      <Section title={<FormattedMessage id="payment_details" />}>
        <Info
          label={<FormattedMessage id="amount" />}
          value={formatAmount(amount.value, amount.currency, "right")}
        />
        <Info
          label={<FormattedMessage id="paymentMethod" />}
          value={<FormattedMessage id={`pm_${paymentMethod}`} />}
        />
        <Info
          label={<FormattedMessage id="cardBin" />}
          value={`${cardBin} **** `}
        />
        <Info label={<FormattedMessage id="reference" />} value={reference} />
        <Info label={<FormattedMessage id="errorCode" />} value={errorCode} />
      </Section>

      <Section title={<FormattedMessage id="client_data" />}>
        <Info label={<FormattedMessage id="fullName" />} value={fullName} />
        <Info label={<FormattedMessage id="email" />} value={email} />
        <Info label={<FormattedMessage id="address" />} value={address} />
        <Info label={<FormattedMessage id="country" />} value={country} />
      </Section>

      <Section title={<FormattedMessage id="payment_method" />}>
        <Info
          label={<FormattedMessage id="cardPan" />}
          value={`**** ${cardPan}`}
        />
        {cardExpirationDate && (
          <Info
            label={<FormattedMessage id="cardExpirationDate" />}
            value={format(cardExpirationDate, "dd/MM/yy")}
          />
        )}
        <Info
          label={<FormattedMessage id="cardCountry" />}
          value={cardCountry}
        />
        <Info label={<FormattedMessage id="clientIp" />} value={clientIp} />
      </Section>

      <Section title={<FormattedMessage id="schedule" />}>
        {createdAt && (
          <Info
            label={<FormattedMessage id="createdAt" />}
            value={createdAt && format(new Date(createdAt), "dd/MM/yy")}
          />
        )}
        {completedAt && (
          <Info
            label={<FormattedMessage id="completedAt" />}
            value={completedAt && format(new Date(completedAt), "dd/MM/yy")}
          />
        )}
      </Section>

      <div className="flex mt-4 gap-4">
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
      </div>
    </div>
  )
}
