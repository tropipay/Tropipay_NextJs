import {
  chargeProductTypes,
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { currencyTypes } from "@/app/filterDefinitions/commons"
import { movementsPaymentMethods } from "@/app/filterDefinitions/movements"
import ImageIcon from "@/components/ui/ImageIcon"

export const chargesColumnsDef: any = {
  createdAt: {
    type: "date",
    showFilter: true,
    enableSorting: true,
    size: 120,
    order: 0,
    enableHiding: false,
  },
  amount: {
    type: "amount",
    showFilter: true,
    order: 1,
    field: `amount { value currency }`,
    enableSorting: true,
    enableHiding: false,
    toClipboard: true,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    order: 2,
    enableHiding: false,
  },
  state: {
    type: "facetedBadge",
    optionList: chargeStates,
    optionListGroups: chargeStatesGroups,
    showFilter: true,
    enableSorting: true,
    order: 3,
    enableHiding: false,
  },
  reference: {
    order: 4,
    showFilter: true,
    enableSorting: true,
    toClipboard: true,
  },
  email: {
    order: 5,
    showFilter: true,
    filterSearchType: "EXACT_MATCH",
    toClipboard: true,
  },
  concept: {
    filter: false,
    hidden: true,
    toClipboard: true,
  },
  bankOrderCode: {
    filter: false,
    hidden: true,
    toClipboard: true,
  },
  summary: {
    filter: false,
    hidden: true,
  },
  clientIp: {
    filter: false,
    hidden: true,
    toClipboard: true,
  },
  cardExpirationDate: {
    filter: false,
    hidden: true,
  },
  cardBin: {
    hidden: true,
    render: (row: any) => (row.cardBin ? `**** ${row.cardBin}` : ""),
    filterSearchType: "EXACT_MATCH",
  },
  cardPan: {
    hidden: true,
    render: (row: any) => (row.cardPan ? `**** ${row.cardPan}` : ""),
    filterSearchType: "EXACT_MATCH",
  },
  cardType: {
    hidden: true,
    filterPlaceholder: "cardType_placeholder",
    render: (row: any) => {
      return (
        <div className="flex items-center">
          {row.cardType && (
            <ImageIcon
              {...{
                image: `/images/cardTypes/${row.cardType}.svg`,
                fallbackImage: `/images/cardTypes/CARD.svg`,
              }}
            />
          )}
          <span className="ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {row.cardType}
          </span>
        </div>
      )
    },
  },
  fullName: {
    hidden: true,
    render: (row: any) => <span className="capitalize">{row.fullName}</span>,
    filterSearchType: "PARTIAL_MATCH",
    toClipboard: true,
  },
  issuerBank: {
    hidden: true,
    toClipboard: true,
  },
  errorCode: {
    hidden: true,
    order: 5,
  },
  product: {
    type: "faceted",
    optionList: chargeProductTypes,
    hidden: true,
    order: 6,
    filterSearchType: "EXACT_MATCH",
  },
  country: {
    filter: false,
    hidden: true,
  },
  address: {
    filter: false,
    hidden: true,
    toClipboard: true,
  },
  currency: {
    filter: false,
    type: "faceted",
    hideColumn: true,
    hidden: true,
    optionList: currencyTypes,
  },
  completedAt: {
    filter: false,
    type: "date",
    size: 120,
    hidden: true,
    enableSorting: true,
  },
  search: {
    filter: false,
    hidden: true,
    meta: { hidden: true },
  },
}
