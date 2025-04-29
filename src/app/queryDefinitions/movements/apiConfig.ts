import { FetchDataConfig } from "@/types/fetchData"
import { setFilters } from "@/utils/data/utils"
import { movementsColumns } from "./movementsColumns"
import { movementsColumnsDef } from "./movementsColumnsDef"
import { movementsDetailColumns } from "./movementsDetail/movementsDetailColumns"
import { movementsDetailColumnsDef } from "./movementsDetail/movementsDetailColumnsDef"
import { movementsScheduledColumns } from "./scheduled/movementsScheduledColumns"
import { movementsScheduledColumnsDef } from "./scheduled/movementsScheduledColumnsDef"

export const movementsApiConfig: Record<string, FetchDataConfig> = {
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
              id
              state
              bankOrderCode
              fee {
                value
                currency
              }
              email
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
              sender
              product
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
  movementsScheduled: {
    key: "movementsScheduled",
    url: "/api/v3/scheduled_transaction",
    method: "GET",
    columns: movementsScheduledColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsScheduledColumnsDef)),
  },
}
