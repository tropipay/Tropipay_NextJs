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
          items { $FIELDS }
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
            id
            reference
            bankOrderCode
            concept
            state
            email
            createdAt
            completedAt
            amount {
              value
              currency
            }
            amountCharged {
              value
              currency
            }
            fee {
              value
              currency
            }
            conversionRate
            movementType
            paymentMethod
            sender
            recipient
            summary
            cardPan
            movementDetail {
              netAmount {
                value
                currency
              }
              concept
              beneficiaryData {
                name
                alias
                account
              }
              senderData {
                name
                lastName
                email
              }
              type
              cardPan
              cardType
              cardCountry
              clientIp
              cardExpirationDate
            }
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
