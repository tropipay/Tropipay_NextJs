import { Button } from "@/components/ui/button"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Table } from "@tanstack/react-table"

interface MovementsAllInOutProps {
  table: Table<any>
}

const MovementsAllInOut: React.FC<MovementsAllInOutProps> = ({ table }) => {
  const movementDirectionFilter = table
    .getState()
    .columnFilters.find((filter) => filter.id === "movementDirection")?.value

  const handleFilterChange = (direction: "IN" | "OUT" | "ALL") => {
    if (direction === "ALL") {
      table.setColumnFilters([])
    } else {
      table.setColumnFilters([{ id: "movementDirection", value: direction }])
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
        <FormattedMessage id="exit" />
      </Button>
    </div>
  )
}

export default MovementsAllInOut
