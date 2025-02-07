import { movementsFilters } from "./movements/filters"
import { movementColumns } from "./movements/movementColumns"

export const apiConfig = {
  movements: {
    key: "generalMovements",
    url: `${process.env.REACT_APP_APP_URL}/api/movements`,
    method: "POST",
    body: {
      operationName: "GetMovements",
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
      movements(filter: $filter, pagination: $pagination) {
        items {
            id
            status
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
