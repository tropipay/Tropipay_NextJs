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
    enableSorting: true,
    size: 120,
    order: 0,
  },
  netAmount: {
    type: "amount",
    title: "amount",
    enableHiding: false,
    filter: false,
    showFilter: true,
    order: 1,
    field: `netAmount { value currency }`,
  },
  amountCharged: {
    type: "amount",
    hidden: true,
    enableSorting: false,
    field: `amountCharged { value currency }`,
  },
  state: {
    type: "facetedBadge",
    optionList: movementStates,
    optionListGroups: movementStateGroups,
    enableHiding: false,
    enableSorting: true,
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
    toClipboard: true,
  },
  reference: {
    hidden: true,
    enableSorting: true,
    filterSearchType: "EXACT_MATCH",
  },
  email: {
    hidden: true,
    filterSearchType: "EXACT_MATCH",
  },
  completedAt: {
    type: "date",
    hidden: true,
    enableSorting: true,
  },
  fee: {
    type: "amount",
    filter: false,
    hidden: true,
    field: `fee { value currency }`,
  },
  conversionRate: {
    filter: false,
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
    render: (row: any) => (row.cardPan ? `**** ${row.cardPan}` : "-"),
    filterSearchType: "EXACT_MATCH",
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
