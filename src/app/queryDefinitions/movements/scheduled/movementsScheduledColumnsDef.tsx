import { movementsScheduledRecurrences } from "@/app/filterDefinitions/movements"
import { MovementScheduled } from "@/types/movements"

export const movementsScheduledColumnsDef: any = {
  amount: {
    type: "amount",
    valueMapper: ({ originAmount: value, currency }: MovementScheduled) => ({
      value,
      currency,
    }),
    order: 0,
  },
  nextDate: { type: "date", title: "date_to_pay", order: 1 },
  fullName: {
    title: "beneficiary",
    valueMapper: ({ depositaccount: { alias } }: MovementScheduled) => (
      <span className="capitalize">{alias}</span>
    ),
    order: 2,
  },
  email: {
    title: "destiny_account",
    valueMapper: ({ depositaccount: { accountNumber } }: MovementScheduled) =>
      accountNumber,
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
