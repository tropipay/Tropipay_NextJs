import {
  movementStateGroups,
  movementStates,
} from "@/app/filterDefinitions/movements"
import { Info } from "@/components/sectionComponents/info"
import { Section } from "@/components/sectionComponents/section"
import FacetedBadge from "@/components/table/facetedBadge"
import { Button } from "@/components/ui/button"
import { fetchHeaders, formatAmount } from "@/lib/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { FormattedMessage } from "react-intl"

export default function MovementDetail(props: any): JSX.Element {
  const row: MovementDetail = props.data.data.movements.items[0]
  const { data: session } = useSession()
  const token = session?.user.token
  const {
    email,
    fee,
    movementDetail: {
      amount,
      state,
      bankOrderCode,
      createdAt,
      completedAt,
      type,
      product,
      concept,
      clientAddress,
      conversionRate,
      netAmount,
      cardType,
      cardPan,
      cardExpirationDate,
      cardCountry,
      clientIp,
      recipientData: { alias, name, account, country },
      senderData: {
        name: senderName,
        email: senderEmail,
        country: senderCountry,
      },
    },
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

  return (
    <div className="max-w-md mx-auto p-4">
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
      <Section title={<FormattedMessage id="movement_data" />}>
        <Info
          label={<FormattedMessage id="type" />}
          value={<FormattedMessage id={`mt_${type}`} />}
        />
        <Info label={<FormattedMessage id="product" />} value={product} />
        <Info label={<FormattedMessage id="concept" />} value={concept} />
      </Section>

      <Section title={<FormattedMessage id="beneficiary_data" />}>
        <Info label={<FormattedMessage id="alias" />} value={alias} />
        <Info label={<FormattedMessage id="name" />} value={name} />
        <Info label={<FormattedMessage id="account" />} value={account} />
        <Info label={<FormattedMessage id="email" />} value={email} />
        <Info label={<FormattedMessage id="country" />} value={country} />
      </Section>

      <Section title={<FormattedMessage id="sender_data" />}>
        <Info label={<FormattedMessage id="name" />} value={senderName} />
        <Info label={<FormattedMessage id="email" />} value={senderEmail} />
        <Info label={<FormattedMessage id="address" />} value={clientAddress} />
        <Info label={<FormattedMessage id="country" />} value={senderCountry} />
      </Section>

      <Section title={<FormattedMessage id="imports" />}>
        <Info
          label={<FormattedMessage id="import" />}
          value={formatAmount(amount.value, amount.currency, "right")}
        />
        {conversionRate && fee && amount.currency !== fee.currency && (
          <Info
            label={<FormattedMessage id="conversionRate" />}
            value={`1 EUR = ${conversionRate} ${amount.currency}`}
          />
        )}
        {fee && (
          <Info
            label={<FormattedMessage id="fee" />}
            value={formatAmount(fee.value, fee.currency, "right")}
          />
        )}
        <Info
          label={<FormattedMessage id="netAmount" />}
          value={`${formatAmount(
            netAmount.value,
            netAmount.currency,
            "right"
          )}`}
        />
      </Section>

      <Section title={<FormattedMessage id="payment_method" />}>
        <Info label={<FormattedMessage id="cardType" />} value={cardType} />
        <Info
          label={<FormattedMessage id="account" />}
          value="******** FALTA CUENTA"
        />
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
            value={format(new Date(createdAt), "dd/MM/yy")}
          />
        )}
        {completedAt && (
          <Info
            label={<FormattedMessage id="completedAt" />}
            value={format(new Date(completedAt), "dd/MM/yy")}
          />
        )}
      </Section>

      <div className="flex mt-4 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={onDownloadInvoiceFile}
        >
          <FormattedMessage id="download" />
        </Button>
        {/*           <Button variant="default" className="w-1/2">
            <FormattedMessage id="refound" />
          </Button>
 */}
      </div>
    </div>
  )
}
