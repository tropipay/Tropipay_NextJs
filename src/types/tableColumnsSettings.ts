import { SortingState, VisibilityState } from "@tanstack/react-table"

export type TableMovementsColumnsSettings = {
  columnOrder: string[]
  columnSorting: SortingState
  columnVisibility: VisibilityState
}

export type TableColumnsSettings = {
  movements: TableMovementsColumnsSettings
}
