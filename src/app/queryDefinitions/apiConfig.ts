import { movementsFilters } from "./movements/filters"
import { movementColumns } from "./movements/movementColumns"

export const apiConfig = {
  movements: {
    key: "generalMovements",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
              id
              state
              creationDate
              valueDate
              description
              amount {
                value
                currency
              }
              movementType
              paymentMethod
              reference
              sender
            }
            totalCount
          }
        }`,
      operationName: "GetMovements",
      variables: {
        filter: {
          amountGte: 1000,
        },
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementColumns,
    filters: JSON.parse(JSON.stringify(movementsFilters)),
  },
}
