import { setFilters } from "@/lib/utils"
import { movementsColumns } from "./movements/movementsColumns"
import { movementsDetailColumns } from "./movementsDetail/movementsDetailColumns"
import { movementsColumnsDef } from "./movements/movementsColumnsDef"
import { movementsDetailColumnsDef } from "./movementsDetail/movementsDetailColumnsDef"
import { FetchDataConfig } from "./types"

export const apiConfig: Record<string, FetchDataConfig> = {
  accounts: {
    key: "",
    url: "/api/v3/accounts",
    method: "GET",
  },
  movements: {
    key: "movements",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
          id
          $FIELDS }
            totalCount
          }
        }`,
      operationName: "GetMovements",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementsColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsColumnsDef)),
    filters: setFilters(movementsColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
  movementsDetail: {
    key: "movementsDetail",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
            amount {
              value
              currency
            }
            amountCharged {
              value
              currency
            }
            bankOrderCode
            cardPan
            charges {
              bankOrderCode
              cardBrand
              cardCountry
              cardExpirationDate
              cardHolderName
              cardPan
              cardType
              clientAddress
              clientEmail
              clientIp
              clientLastName
              clientName
              createdAt
              email
              errorCode
              issuerBank
              source
              state
            }
            completedAt
            concept
            conversionRate
            createdAt
            email
            fee {
              value
              currency
            }
            id
            movementDetail {
              amount{
                currency
                value
              }
              cardCountry
              cardExpirationDate
              cardPan
              cardType
              chargedAmount{
                currency
                value
              }
              clientAddress
              clientIp
              completedAt
              concept
              conversionRate
              createdAt
              netAmount {
                value
                currency
              }
              recipientData{
                alias
                name
                account
              }
              senderData {
                name
                lastName
                email
              }
              type
            }
            movementType
            paymentMethod
            recipient
            reference
            sender
            state
            summary
          }
            totalCount
          }
        }`,
      operationName: "GetMovements",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementsDetailColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsDetailColumnsDef)),
    filters: setFilters(movementsDetailColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
}
