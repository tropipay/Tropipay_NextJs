import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
import React from "react"
import { FormattedMessage } from "react-intl"

interface MovementsAllInOutProps {
  table: Table<any>
}

const MovementsAllInOut: React.FC<MovementsAllInOutProps> = ({ table }) => {
  const movementDirectionFilter = table
    .getState()
    .columnFilters.find((filter) => filter.id === "movementDirection")?.value

  const handleFilterChange = (direction: "IN" | "OUT" | "ALL") => {
    // Get the current filters from the table state
    const currentFilters = table.getState().columnFilters

    if (direction === "ALL") {
      // Remove only the "movementDirection" filter
      const updatedFilters = currentFilters.filter(
        (filter) => filter.id !== "movementDirection"
      )
      table.setColumnFilters(updatedFilters)
    } else {
      // Filter out any existing "movementDirection" filter to avoid duplicates
      const updatedFilters = currentFilters.filter(
        (filter) => filter.id !== "movementDirection"
      )
      // Add the new movementDirection filter
      updatedFilters.push({ id: "movementDirection", value: direction })
      table.setColumnFilters(updatedFilters)
    }
  }

  return (
    <div className="flex items-center gap-1 bg-grayBackground p-1 rounded-md">
      <Button
        variant={
          movementDirectionFilter === undefined
            ? "filterActive"
            : "filterInactive"
        }
        className="px-2 h-8"
        onClick={() => handleFilterChange("ALL")}
      >
        <FormattedMessage id="all" />
      </Button>
      <Button
        variant={
          movementDirectionFilter === "IN" ? "filterActive" : "filterInactive"
        }
        className="px-2 h-8"
        onClick={() => handleFilterChange("IN")}
      >
        <FormattedMessage id="entry" />
      </Button>
      <Button
        variant={
          movementDirectionFilter === "OUT" ? "filterActive" : "filterInactive"
        }
        className="px-2 h-8"
        onClick={() => handleFilterChange("OUT")}
      >
        <FormattedMessage id="output" />
      </Button>
    </div>
  )
}

export default MovementsAllInOut
