"use client"

import Spinner from "@/components/Spinner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui"
import { objToHash, toActiveObject, toArrayId } from "@/utils/data/utils"
import { getUserSettings, setUserSettings } from "@/utils/user/utilsUser"
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
import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableToolbar } from "./DataTableToolbar"

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
}

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
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const columnsId = columnsConfig
    .filter(({ id }) => !!id)
    .map(({ id }) => id ?? "")
  const [tableKey, setTableKey] = useState(0)

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

      // Crear un nuevo objeto URLSearchParams basado en los searchParams actuales
      const params = new URLSearchParams(searchParams)

      // Eliminar solo los parámetros de búsqueda que corresponden a los filtros
      columnsFilters.forEach((filter) => {
        // @ts-ignore
        params.delete(filter.id)
      })

      // Agregar los nuevos filtros al objeto URLSearchParams
      newFilters.forEach((filter) => {
        if (filter.value !== null && filter.value !== undefined) {
          params.set(filter.id, JSON.stringify(filter.value).replace(/"/g, ""))
        }
      })

      // Actualizar la URL sin afectar otros parámetros como paginación u orden
      setIsLoading(true)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [columnFilters, columnsConfig, router, pathname, searchParams]
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    defaultColumnOrder ||
      getUserSettings(userId, null, tableId, "columnOrder") ||
      // @ts-ignore
      toArrayId(columnsConfig, "hidden", (hiddenValue) => !hiddenValue, "order")
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

  const onColumnVisibilityChange = useCallback(
    (updater: Updater<typeof columnVisibility>) => {
      const visibilityState =
        typeof updater === "function" ? updater(columnVisibility) : updater
      setColumnVisibility(visibilityState)
      setUserSettings(userId, visibilityState, tableId, "columnVisibility")

      if (Object.keys(columnVisibility).length !== 0) {
        const columnHash = objToHash(columnVisibility)
        // Obtener los search params actuales
        const currentSearchParams = new URLSearchParams(window.location.search)
        // Actualizar solo el columnHash
        currentSearchParams.set("columnHash", columnHash)
        setIsLoading(true)
        router.push(`${pathname}?${currentSearchParams.toString()}`, {
          scroll: false,
        })
      }
    },
    [columnVisibility, userId, pathname] // Añadí pathname a las dependencias
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
        className="sticky top-0 border-b-1 border-gray-500 bg-white whitespace-nowrap"
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
    [data, columnOrder]
  )

  const table = useReactTable(tableConfig)

  const handleRowClick = (row: TData) => {
    setSelectedRow(row)
    setIsSheetOpen(true)
  }

  useEffect(() => {
    setTableKey(Math.random())
    setIsLoading(false)
  }, [data])

  if (userId)
    return (
      <div className="space-y-4">
        {isLoading && <Spinner />}
        {enableToolbar && (
          <DataTableToolbar
            {...{
              tableId,
              table,
              columns: columnsConfig,
              categoryFilterId,
              categoryFilters,
            }}
          />
        )}
        <div>
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
                          <DraggableTableHeader
                            key={header.id}
                            header={header}
                          />
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
              <TableBody className="tableBody">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      rowData={row.original}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-gray-100"
                      // @ts-ignore
                      onRowClick={handleRowClick}
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
                      <FormattedMessage id="no_results_found" />
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
            <div className="pt-2">
              <div className="mt-6 h-screen overflow-y-auto">
                {selectedRow && RowClickChildren && (
                  <RowClickChildren row={selectedRow} />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
}
