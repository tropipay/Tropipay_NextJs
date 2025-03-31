import {
  movementsPaymentMethods,
  movementStateGroups,
  movementStates,
  movementTypes,
} from "@/app/filterDefinitions/movements"

export const movementsColumnsDef: any = {
  /* select: {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  }, */
  createdAt: {
    type: "date",
    showFilter: true,
    enableHiding: false,
    size: 120,
    order: 0,
  },
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
    order: 1,
    field: `amount { value currency }`,
  },
  amountCharged: {
    type: "amount",
    hidden: true,
    field: `amountCharged { value currency }`,
  },
  state: {
    type: "facetedBadge",
    optionList: movementStates,
    optionListGroups: movementStateGroups,
    enableHiding: false,
    showFilter: true,
    order: 2,
  },
  sender: {
    enableHiding: false,
    order: 3,
  },
  movementType: {
    type: "faceted",
    title: "type",
    showFilter: true,
    optionList: movementTypes,
    enableSorting: false,
    size: 200,
    order: 4,
  },
  concept: {
    showFilter: true,
    order: 5,
  },
  product: {
    hidden: true,
  },
  bankOrderCode: {
    order: 6,
  },
  reference: {
    hidden: true,
  },
  email: {
    hidden: true,
  },
  completedAt: {
    type: "date",
    hidden: true,
  },
  fee: {
    type: "amount",
    hidden: true,
    field: `fee { value currency }`,
  },
  conversionRate: {
    hidden: true,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    hidden: true,
  },
  recipient: {
    hidden: true,
  },
  summary: {
    hidden: true,
  },
  cardPan: {
    hidden: true,
    render: (value: string) => `**** ${value}`,
  },
  movementDirection: {
    hidden: true,
    meta: { hidden: true },
  },
  search: {
    hidden: true,
    meta: { hidden: true },
  },
}
