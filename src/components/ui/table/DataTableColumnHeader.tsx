import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  Cross2Icon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { cn } from "@/utils/data/utils"
import { FormattedMessage } from "react-intl"

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
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-semibold data-[state=open]:bg-accent"
          >
            <FormattedMessage id={title} />
            {(column.getCanSort() || column.getCanHide()) &&
              (column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <CaretSortIcon className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </DropdownMenuTrigger>
        {(column.getCanSort() || column.getCanHide()) && (
          <DropdownMenuContent align="start">
            {!!column.getCanSort() && (
              <>
                {/* Opción de orden ascendente o eliminar ordenamiento */}
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === "asc") {
                      column.clearSorting() // Si ya está ordenado asc, elimina el ordenamiento
                    } else {
                      column.toggleSorting(false) // Si no, ordena asc
                    }
                  }}
                >
                  {column.getIsSorted() === "asc" ? (
                    <Cross2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  ) : (
                    <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  )}
                  <FormattedMessage id="asc" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (column.getIsSorted() === "desc") {
                      column.clearSorting()
                    } else {
                      column.toggleSorting(true)
                    }
                  }}
                >
                  {column.getIsSorted() === "desc" ? (
                    <Cross2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  ) : (
                    <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  )}
                  <FormattedMessage id="desc" />
                </DropdownMenuItem>
              </>
            )}
            {column.getCanHide() && !!column.getCanSort() && (
              <DropdownMenuSeparator />
            )}
            {column.getCanHide() && (
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                <FormattedMessage id="hide" />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
