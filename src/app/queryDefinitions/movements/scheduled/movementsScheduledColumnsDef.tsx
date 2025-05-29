import { movementsScheduledRecurrences } from "@/app/filterDefinitions/movements"
import { renderedAmount } from "@/components/table/SetColumn"
import { TextToCopy } from "@/components/TextToCopy"
import { MovementScheduled } from "@/types/movements"

export const movementsScheduledColumnsDef: any = {
  amount: {
    render: (row: any) => {
      return renderedAmount(row.originAmount, row.currency, true, true)
    },
    order: 0,
  },
  nextDate: { type: "date", title: "date_to_pay", order: 1 },
  fullName: {
    title: "beneficiary",
    render: (row: any) => (
      <TextToCopy value={row.depositaccount.alias} className="capitalize" />
    ),
    order: 2,
  },
  email: {
    title: "destiny_account",
    render: (row: any) => (
      <TextToCopy
        value={row.depositaccount.accountNumber}
        className="capitalize"
      />
    ),
    order: 3,
  },
  frecuency: {
    type: "faceted",
    title: "recurrence",
    optionList: movementsScheduledRecurrences,
    order: 4,
  },
  conceptTransfer: { title: "concept", order: 5 },
}
