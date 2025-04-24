import { Info } from "@/components/sectionComponents/Info"
import { Section } from "@/components/sectionComponents/Section"
import { Button } from "@/components/ui"
import { MovementScheduled } from "@/types/movements"
import { formatAmount } from "@/utils/data/utils"
import { format } from "date-fns"
import { FormattedMessage } from "react-intl"

export default function MovementScheduledDetail(props: any): JSX.Element {
  const row: MovementScheduled = props.data

  const {
    createdAt,
    originAmount,
    currency,
    depositaccount: { alias, accountNumber },
    nextDate,
    frecuency,
    conceptTransfer,
  } = row

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
          {originAmount > 0 ? "+" : ""}
          {formatAmount(originAmount, currency, "right")}
        </div>
        {/* <FacetedBadge
          value={state}
          optionList={movementStates}
          optionListGroups={movementStateGroups}
        /> */}
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
      <Section title={<FormattedMessage id="client_data" />}>
        <Info
          label={<FormattedMessage id="beneficiary" />}
          value={<span className="capitalize">{alias}</span>}
        />
        <Info
          label={<FormattedMessage id="destiny_account" />}
          value={accountNumber}
        />
        <Info
          label={<FormattedMessage id="concept" />}
          value={conceptTransfer}
        />
      </Section>

      <Section title={<FormattedMessage id="payment_details" />}>
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
      </Section>

      <Section title={<FormattedMessage id="schedule" />}>
        {createdAt && (
          <Info
            label={<FormattedMessage id="createdAt" />}
            value={format(new Date(createdAt), "dd/MM/yy")}
          />
        )}
        {nextDate && (
          <Info
            label={<FormattedMessage id="date_to_pay" />}
            value={format(new Date(nextDate), "dd/MM/yy")}
          />
        )}
        {frecuency && (
          <Info
            label={<FormattedMessage id="recurrence" />}
            value={<FormattedMessage id={`mr_${frecuency}`} />}
          />
        )}
      </Section>

      <div className="flex mt-4 gap-4">
        <Button variant="default" className="w-full">
          <FormattedMessage id="cancel_scheduled" />
        </Button>
      </div>
    </div>
  )
}
