import { setFilters } from "@/lib/utils"
import { movementsColumns } from "./movements/movementsColumns"
import { movementsColumnsDef } from "./movements/movementsColumnsDef"
import { FetchDataConfig } from "./types"
import { movementsDefaultColumnOrder } from "./movements/movementsDefaultColumnOrder"

export const apiConfig: Record<string, FetchDataConfig> = {
  accounts: {
    key: "",
    url: "/api/v3/accounts",
    method: "GET",
  },
  movements: {
    key: "generalMovements",
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
        filter: {
          amountGte: 1000,
        },
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementsColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsColumnsDef)),
    defaultColumnOrder: movementsDefaultColumnOrder,
    filters: setFilters(movementsColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
}
