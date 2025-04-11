import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
import React from "react"
import { FormattedMessage } from "react-intl"

interface Props {
  table: Table<any>
  categoryFilterId: string
  categoryFilters?: string[]
}

const FilterCategories: React.FC<Props> = ({
  table,
  categoryFilterId,
  categoryFilters,
}) => {
  const filterCategoryValue = table
    .getState()
    .columnFilters.find((filter) => filter.id === categoryFilterId)?.value

  const handleFilterChange = (categoryFilterSelected: string) => {
    // Get the current filters from the table state.
    const currentFilters = table.getState().columnFilters

    // Remove only the categoryFilterId filter.
    const updatedFilters = currentFilters.filter(
      ({ id }) => id !== categoryFilterId
    )

    if (categoryFilterSelected !== "ALL") {
      // Add the new categoryFilterId filter.
      updatedFilters.push({
        id: categoryFilterId,
        value: categoryFilterSelected,
      })
    }
    table.setColumnFilters(updatedFilters)
  }

  return (
    <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
      {categoryFilters?.map((categoryFilter) => (
        <Button
          key={categoryFilter}
          variant={
            filterCategoryValue === categoryFilter ||
            (filterCategoryValue === undefined && categoryFilter === "ALL")
              ? "filterActive"
              : "filterInactive"
          }
          className="px-2 h-8"
          onClick={() => handleFilterChange(categoryFilter)}
        >
          <FormattedMessage id={`fc_${categoryFilter}`} />
        </Button>
      ))}
    </div>
  )
}

export default FilterCategories
