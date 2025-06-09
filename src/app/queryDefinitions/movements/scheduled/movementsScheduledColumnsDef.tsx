import { movementsScheduledRecurrences } from "@/app/filterDefinitions/movements"
import { TextToCopy } from "@/components/copyToClipboard/TextToCopy"
import { renderedAmount } from "@/components/ui/table/SetColumn"

export const movementsScheduledColumnsDef: any = {
  amount: {
    render: (row: any) => {
      return renderedAmount(row.originAmount, row.currency, true, true)
    },
    order: 0,
    toClipboard: true,
  },
  nextDate: { type: "date", title: "date_to_pay", order: 1 },
  fullName: {
    title: "beneficiary",
    render: (row: any) => (
      <TextToCopy value={row.depositaccount.alias} className="capitalize" />
    ),
    order: 2,
    toClipboard: true,
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
    toClipboard: true,
  },
  frecuency: {
    type: "faceted",
    title: "recurrence",
    optionList: movementsScheduledRecurrences,
    order: 4,
  },
  conceptTransfer: { title: "concept", order: 5, toClipboard: true },
}
