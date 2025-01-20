import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons"

import { Column } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FormattedMessage } from "react-intl"
import useFilterParams from "@/hooks/useFilterParams"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { setParams, getParam } = useFilterParams()
  if (!column.getCanSort()) {
    return (
      <div className={cn(className)}>
        <FormattedMessage id={title} />
      </div>
    )
  }

  const filtered = getParam("filter") === title
  const orderAsc = filtered && getParam("order") === "asc"
  const orderDesc = filtered && getParam("order") === "desc"

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <FormattedMessage id={title} />
            {filtered && orderDesc ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : filtered && orderAsc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              if (filtered && orderAsc) {
                setParams({ filter: "", order: "" })
              } else {
                setParams({ filter: title, order: "asc" })
              }
            }}
          >
            {filtered && orderAsc ? (
              <CrossCircledIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            ) : (
              <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            )}
            <FormattedMessage id="asc" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (filtered && orderDesc) {
                setParams({ filter: "", order: "" })
              } else {
                setParams({ filter: title, order: "desc" })
              }
            }}
          >
            {filtered && orderDesc ? (
              <CrossCircledIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            ) : (
              <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            )}

            <FormattedMessage id="desc" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            <FormattedMessage id="hide" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
