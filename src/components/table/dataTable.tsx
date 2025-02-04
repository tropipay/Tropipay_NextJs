"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useState } from "react"
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
  OnChangeFn,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { GripVerticalIcon } from "lucide-react"
import { DataTablePagination } from "./dataTablePagination"
import { DataTableToolbar } from "./dataTableToolbar"

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  enableColumnOrder?: boolean
  blockedColumnOrder?: UniqueIdentifier[]
  defaultColumnOrder?: string[]
  defaultColumnVisibility?: VisibilityState
  onChangeColumnOrder?: (_: string[]) => void
  onChangeColumnVisibility?: (_: Updater<VisibilityState>) => void
  onChangeSorting?: (_: SortingState) => void
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  rowCount?: number
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  enableColumnOrder = false,
  blockedColumnOrder = ["select"],
  defaultColumnOrder,
  defaultColumnVisibility = {},
  onChangeColumnOrder,
  onChangeColumnVisibility,
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
      if (
        key !== "sort" &&
        key !== "order" &&
        key !== "page" &&
        key !== "size"
      ) {
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

  const handleFiltersChange = useCallback(
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
    defaultColumnOrder ??
      columns.filter(({ id }) => !!id).map(({ id }) => id ?? "")
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
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
        onChangeColumnOrder?.(newColumnOrder)
        return newColumnOrder
      })
    }
  }

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    visibilityState
  ) => {
    setColumnVisibility(visibilityState)
    onChangeColumnVisibility?.(visibilityState)
  }

  const handlePaginationChange = useCallback(
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

  const handleSortingChange = useCallback(
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
    columns,
    pageCount: Math.ceil(rowCount / pagination.pageSize) ?? -1,
    state: {
      sorting,
      columnVisibility,
      columnFilters, // Pasar los filtros inicializados
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
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleFiltersChange,
    onColumnVisibilityChange,
    onColumnOrderChange: setColumnOrder,
  })

  const DraggableTableHeader = ({
    header,
  }: {
    header: Header<TData, unknown>
  }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform } =
      useSortable({
        id: header.column.id,
      })

    const style: CSSProperties = {
      position: "relative",
      transform: CSS.Translate.toString(transform),
      transition: "width transform 0.2s ease-in-out",
      whiteSpace: "nowrap",
      ...(isDragging && { opacity: 0.8, zIndex: 1 }),
    }

    return (
      <TableHead key={header.id} ref={setNodeRef} style={style}>
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

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} columns={columns} />
      <div className="rounded-md border">
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
                items={columnOrder}
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
                    colSpan={columns.length}
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
    </div>
  )
}
