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
  },
  amount: {
    type: "amount",
    showFilter: true,
    order: 1,
    field: `amount { value currency }`,
    enableSorting: true,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    order: 2,
  },
  state: {
    type: "facetedBadge",
    optionList: chargeStates,
    optionListGroups: chargeStatesGroups,
    showFilter: true,
    enableSorting: true,
    order: 3,
  },
  reference: {
    order: 4,
    showFilter: true,
    enableSorting: true,
  },
  email: {
    order: 5,
    showFilter: true,
    filterSearchType: "EXACT_MATCH",
  },
  concept: {
    filter: false,
    hidden: true,
  },
  bankOrderCode: {
    filter: false,
    hidden: true,
  },
  summary: {
    filter: false,
    hidden: true,
  },
  clientIp: {
    filter: false,
    hidden: true,
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
          <span className="ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
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
  },
  issuerBank: {
    hidden: true,
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
