"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui"
import Spinner from "@/components/ui/spinner/Spinner"
import { cn, objToHash, toActiveObject, toArrayId } from "@/utils/data/utils"
import { getUserSettings, setUserSettings } from "@/utils/user/utilsUser"
import { callPostHog } from "@/utils/utils"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ListFilterIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"
import DataTableDraggableHeader from "./DataTableDraggableHeader"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableToolbar } from "./DataTableToolbar"
import { FilterTypeRenderer } from "./FilterTypeRenderer"

interface DataTableProps<TData, TValue> {
  tableId: string
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  userId: string
  categoryFilterId?: string
  categoryFilters?: string[]
  enableToolbar?: boolean
  enableColumnOrder?: boolean
  blockedColumnOrder?: UniqueIdentifier[]
  defaultColumnOrder?: string[]
  defaultColumnVisibility?: VisibilityState
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  rowCount?: number
  rowClickChildren?: React.ComponentType<{ row: TData }>
  toolbarActions?: React.ReactNode
}

/**
 * DataTable Component
 *
 * This component renders a dynamic table with sorting, filtering, pagination,
 * and column ordering functionalities. It uses TanStack Table for data handling
 * and dnd-kit for drag and drop interactions.
 */
export default function DataTable<TData, TValue>({
  tableId,
  data,
  columns: columnsConfig,
  userId,
  categoryFilterId = "",
  categoryFilters = [],
  enableToolbar = true,
  enableColumnOrder = true,
  blockedColumnOrder = ["select"],
  defaultColumnOrder,
  defaultColumnVisibility,
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
  rowCount,
  rowClickChildren: RowClickChildren,
  toolbarActions,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TData | null>(null)
  const [selectedText, setSelectedText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const columnsId = columnsConfig
    .filter(({ id }) => !!id)
    .map(({ id }) => id ?? "")
  const [tableKey, setTableKey] = useState(0)
  const postHog = usePostHog()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortField = searchParams.get("sort")
    const order = searchParams.get("order")
    return sortField ? [{ id: sortField, desc: order === "desc" }] : []
  })

  const [pagination, setPagination] = useState({
    pageIndex: Number(searchParams.get("page") ?? 0),
    pageSize: Number(searchParams.get("size") ?? 50),
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    searchParams.forEach((value, key) => {
      if (!["sort", "order", "page", "size"].includes(key)) {
        try {
          filters.push({
            id: key,
            value: value,
          })
        } catch (error) {
          console.error("Error parsing filter value:", error)
        }
      }
    })
    return filters
  })

  const onColumnFiltersChange = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      // @ts-ignore
      const columnsFilters = columnsConfig.filter((item) => item.filter)
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater
      setColumnFilters(newFilters)

      // Create a new URLSearchParams object based on the current searchParams
      const params = new URLSearchParams(searchParams)

      // Delete only the search parameters that correspond to the filters
      columnsFilters.forEach((filter) => {
        // @ts-ignore
        params.delete(filter.id)
      })

      // Adds the new filters to the URLSearchParams object
      newFilters.forEach((filter) => {
        if (filter.value !== null && filter.value !== undefined) {
          params.set(filter.id, JSON.stringify(filter.value).replace(/"/g, ""))
        }
      })

      if (params.has("page")) {
        params.delete("page")
      }

      // Updates the URL without affecting other parameters such as pagination or order
      setIsLoading(true)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [columnFilters, columnsConfig, router, pathname, searchParams]
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    defaultColumnOrder ||
      getUserSettings(userId, null, tableId, "columnOrder") ||
      // @ts-ignore
      toArrayId(columnsConfig, "order", (value) => value >= 0, "order")
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility ||
      getUserSettings(userId, null, tableId, "columnVisibility") ||
      toActiveObject(
        // @ts-ignore
        columnsConfig,
        "hidden",
        (hiddenValue) => !hiddenValue,
        "order"
      )
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const handleDragStart = ({ active }: DragStartEvent) =>
    active.id || !blockedColumnOrder.includes(active.id)

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string)
        const newIndex = columnOrder.indexOf(over.id as string)
        const newColumnOrder = arrayMove(columnOrder, oldIndex, newIndex)
        setUserSettings(userId, newColumnOrder, tableId, "columnOrder")
        return newColumnOrder
      })
    }
  }

  const handleRowClick = (row: TData) => {
    setSelectedRow(row)
    setIsSheetOpen(true)
    callPostHog(postHog, "data_table:show_details", { table_id: tableId })
  }

  const onColumnVisibilityChange = useCallback(
    (updater: Updater<typeof columnVisibility>) => {
      const visibilityState =
        typeof updater === "function" ? updater(columnVisibility) : updater
      setColumnVisibility(visibilityState)
      setUserSettings(userId, visibilityState, tableId, "columnVisibility")

      if (Object.keys(columnVisibility).length !== 0) {
        const columnHash = objToHash(columnVisibility)
        // Get the current search params
        const currentSearchParams = new URLSearchParams(window.location.search)
        // Update only the columnHash
        currentSearchParams.set("columnHash", columnHash)
        setIsLoading(true)
        router.push(`${pathname}?${currentSearchParams.toString()}`, {
          scroll: false,
        })
      }
    },
    [columnVisibility, userId, pathname] // Added pathname to dependencies
  )

  const onPaginationChange = useCallback(
    (updater: Updater<typeof pagination>) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater
      setPagination(newPagination)
      if (manualPagination) {
        setIsLoading(true)
        router.push(
          `${pathname}?${createQueryString({
            page: String(newPagination.pageIndex),
            size: String(newPagination.pageSize),
          })}`,
          { scroll: false }
        )
      }
    },
    [pagination, manualPagination, router, pathname, createQueryString]
  )

  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater
      setSorting(newSorting)
      if (manualSorting) {
        setIsLoading(true)
        router.push(
          `${pathname}?${createQueryString({
            sort: newSorting[0]?.id ?? null,
            order: newSorting[0]?.desc ? "desc" : null,
            page: "0",
          })}`,
          { scroll: false }
        )
      }
    },
    [sorting, manualSorting, router, pathname, createQueryString]
  )

  const tableConfig = useMemo(
    () => ({
      data: Array.isArray(data) ? data : [],
      columns: columnsConfig,
      pageCount: rowCount ? Math.ceil(rowCount / pagination.pageSize) : -1,
      state: {
        sorting,
        columnVisibility,
        columnFilters,
        columnOrder,
        pagination,
      },
      manualPagination,
      manualSorting,
      manualFiltering,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange,
      onSortingChange,
      onColumnFiltersChange,
      onColumnVisibilityChange,
      onColumnOrderChange: setColumnOrder,
    }),
    [data, columnOrder, pagination]
  )

  const table = useReactTable(tableConfig)

  const getHeaderActionsForColumn = (id: string) => {
    const handleClearFilter = (filterId: string) => {
      const appliedFilters = table.getState().columnFilters
      const remainingFilters = appliedFilters.filter(
        (filter) => filter.id !== filterId
      )
      table.setColumnFilters(remainingFilters)
    }

    return (
      <>
        <Popover>
          <PopoverTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <ListFilterIcon
                  size={16}
                  className={cn(
                    "hover:opacity-100 cursor-pointer",
                    columnFilters.some(({ id: columnId }) => columnId === id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <FormattedMessage id="filter" />
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-auto"
            align="center"
            side="bottom"
            //@ts-ignore
            enableAnimation={false}
          >
            <FilterTypeRenderer
              defaultOpenFilterOptions
              {...{
                tableId,
                table,
                activeFilter: false,
                handleClearFilter,
                column: columnsConfig.find(
                  ({ id: columnId }) => columnId === id
                ),
              }}
            />
          </PopoverContent>
        </Popover>
      </>
    )
  }

  useEffect(() => {
    setTableKey(Math.random())
    setIsLoading(false)
  }, [data, tableConfig])

  useEffect(
    () =>
      setPagination({
        pageIndex: Number(searchParams.get("page") ?? 0),
        pageSize: Number(searchParams.get("size") ?? 50),
      }),
    [searchParams]
  )

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setSelectedText(window.getSelection()?.toString() ?? "")
    }
    document.addEventListener("mouseup", handleGlobalMouseUp)
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  if (userId)
    return (
      <>
        <div>
          {isLoading && <Spinner />}
          {enableToolbar && (
            <DataTableToolbar
              {...{
                tableId,
                table,
                columns: columnsConfig,
                categoryFilterId,
                categoryFilters,
                actions: toolbarActions,
              }}
            />
          )}
          <div className="mt-2">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToHorizontalAxis]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <Table className="tableComponent" key={tableKey}>
                <TableHeader>
                  <SortableContext
                    items={columnsId}
                    strategy={horizontalListSortingStrategy}
                  >
                    {table.getHeaderGroups().map(({ id, headers }) => (
                      <TableRow key={id}>
                        {headers.map((header) =>
                          enableColumnOrder ? (
                            <DataTableDraggableHeader
                              key={header.id}
                              header={header}
                              actions={getHeaderActionsForColumn(header.id)}
                            />
                          ) : (
                            <TableHead
                              key={header.id}
                              data-test-id={`dataTable-tableHead-sortBy-${header.id}`}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        )}
                      </TableRow>
                    ))}
                  </SortableContext>
                </TableHeader>
                <TableBody className="tableBody">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <ContextMenu key={row.id}>
                        <ContextMenuTrigger asChild>
                          <TableRow
                            rowData={row.original}
                            data-state={row.getIsSelected() && "selected"}
                            className="cursor-pointer hover:bg-gray-100"
                            data-test-id="dataTable-tableRow-openDetail"
                            onClick={(e) => {
                              if (window.getSelection()?.toString() === "") {
                                handleRowClick(row.original)
                              }
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                style={{ userSelect: "text" }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-[200px] bg-white shadow-md">
                          {selectedText && (
                            <ContextMenuItem
                              className="h-[30px] hover:bg-gray-200 flex items-center justify-start px-2"
                              onSelect={() => {
                                navigator.clipboard.writeText(selectedText)
                              }}
                            >
                              <FormattedMessage id="copy" />
                            </ContextMenuItem>
                          )}
                          <ContextMenuItem
                            className="h-[30px] hover:bg-gray-200 flex items-center justify-start px-2"
                            onSelect={() => {
                              selectedRow && handleRowClick(selectedRow)
                            }}
                          >
                            <FormattedMessage id="show_details" />
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        style={{ userSelect: "text" }}
                        colSpan={columnsConfig.length}
                        className="h-24 text-center"
                      >
                        <FormattedMessage id="no_results_found" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <DataTablePagination table={table} />
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetHeader>
            <SheetTitle />
            <SheetDescription />
          </SheetHeader>
          <SheetContent className="sm:w-full md:min-w-[500px]">
            <div className="pt-4 h-full">
              {selectedRow && RowClickChildren && (
                <RowClickChildren row={selectedRow} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
}
