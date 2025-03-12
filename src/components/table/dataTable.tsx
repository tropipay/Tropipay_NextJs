"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { GripVerticalIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CSSProperties, useCallback, useEffect, useState } from "react"
import { DataTablePagination } from "./dataTablePagination"
import { DataTableToolbar } from "./dataTableToolbar"
import CookiesManager from "@/lib/cookiesManager"
// import { objToHash } from "@/lib/utils"
import { objToHash } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface DataTableProps<TData, TValue> {
  tableId: string
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  enableColumnOrder?: boolean
  blockedColumnOrder?: UniqueIdentifier[]
  defaultColumnOrder?: string[]
  defaultColumnVisibility?: VisibilityState
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  rowCount?: number
  rowClickChildren?: React.ComponentType<{ row: TData }>
}

export default function DataTable<TData, TValue>({
  tableId,
  data,
  columns: columnsConfig,
  enableColumnOrder = true,
  blockedColumnOrder = ["select"],
  defaultColumnOrder,
  defaultColumnVisibility,
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
  rowCount,
  rowClickChildren: RowClickChildren,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TData | null>(null)
  const { data: session } = useSession()
  const userId = session?.user?.id
  const columnsId = columnsConfig
    .filter(({ id }) => !!id)
    .map(({ id }) => id ?? "")

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
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      const queryString = newFilters
        .map(
          (filter) =>
            `${filter.id}=${JSON.stringify(filter.value).replace(/"/g, "")}`
        )
        .join("&")
      router.push(`${pathname}?${queryString}`, { scroll: false })
    },
    [columnFilters, router, pathname]
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    defaultColumnOrder
      ? [
          ...defaultColumnOrder,
          ...columnsId.filter((v) => !defaultColumnOrder.includes(v)),
        ]
      : columnsId
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility ??
      columnsConfig.reduce((acc, column: any) => {
        acc[column.id] = !column.hidden
        return acc
      }, {})
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
        onChangeColumnOrder(newColumnOrder)
        return newColumnOrder
      })
    }
  }

  const onChangeColumnOrder = (columnOrder: string[]) => {
    if (!userId) return
    const columnsSettings =
      CookiesManager.getInstance().get(`userSettings-${userId}`)
        ?.tableColumnsSettings || {}
    const tableColumnsSettings = {
      ...columnsSettings,
      [tableId]: { ...columnsSettings[tableId], columnOrder },
    }
    CookiesManager.getInstance().set(`userSettings-${userId}`, {
      tableColumnsSettings,
    })
  }

  const onChangeColumnVisibility = (columnVisibility: VisibilityState) => {
    if (!userId) return
    const columnsSettings =
      CookiesManager.getInstance().get(`userSettings-${userId}`)
        ?.tableColumnsSettings || {}
    const tableColumnsSettings = {
      ...columnsSettings,
      [tableId]: { ...columnsSettings[tableId], columnVisibility },
    }
    CookiesManager.getInstance().set(`userSettings-${userId}`, {
      tableColumnsSettings,
    })
    if (Object.keys(columnVisibility).length !== 0) {
      const columnHash = objToHash(columnVisibility)
      router.push(
        `${pathname}?${createQueryString({
          columnHash: columnHash,
        })}`,
        { scroll: false }
      )
    }
  }

  const onColumnVisibilityChange = useCallback(
    (updater: Updater<typeof columnVisibility>) => {
      const visibilityState =
        typeof updater === "function" ? updater(columnVisibility) : updater
      setColumnVisibility(visibilityState)
      onChangeColumnVisibility(visibilityState)
    },
    [columnVisibility]
  )

  const DraggableTableHeader = ({
    header,
  }: {
    header: Header<TData, unknown>
  }) => {
    const { attributes, isDragging, listeners, transform, setNodeRef } =
      useSortable({
        id: header.column.id,
      })

    const style: CSSProperties = {
      transform: CSS.Translate.toString(transform),
      transition: "width transform 0.2s ease-in-out",
      ...(isDragging && { opacity: 0.8, zIndex: 1 }),
    }

    return (
      <TableHead
        key={header.id}
        ref={setNodeRef}
        className="relative whitespace-nowrap"
        style={style}
      >
        <div className="flex gap-1 items-center">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <GripVerticalIcon
            size={16}
            className="opacity-0 hover:opacity-100"
            {...attributes}
            {...listeners}
          />
        </div>
      </TableHead>
    )
  }

  const onPaginationChange = useCallback(
    (updater: Updater<typeof pagination>) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater
      setPagination(newPagination)
      if (manualPagination) {
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

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: columnsConfig,
    pageCount: Math.ceil(rowCount ?? 0 / pagination.pageSize) ?? -1,
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
  })

  const handleRowClick = (row: TData) => {
    setSelectedRow(row)
    setIsSheetOpen(true)
  }

  /*   useEffect(() => {
    if (data.length === 0) {
      toastMessage(
        <FormattedMessage id="no_movements" />,
        <FormattedMessage id="no_movements_display" />
      )
    }
  }, [data])
 */
  return (
    <div className="space-y-4">
      <DataTableToolbar
        tableId={tableId}
        table={table}
        columns={columnsConfig}
      />
      <div>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader>
              <SortableContext
                items={columnsId}
                strategy={horizontalListSortingStrategy}
              >
                {table.getHeaderGroups().map(({ id, headers }) => (
                  <TableRow key={id}>
                    {headers.map((header) =>
                      enableColumnOrder ? (
                        <DraggableTableHeader key={header.id} header={header} />
                      ) : (
                        <TableHead key={header.id}>
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
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row.original)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsConfig.length}
                    className="h-24 text-center"
                  >
                    {"No data results"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <DataTablePagination table={table} />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <SheetContent className="min-w-[500px]">
          <div className="mt-6">
            {selectedRow && RowClickChildren && (
              <RowClickChildren row={selectedRow} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
