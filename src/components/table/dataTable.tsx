"use client"

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
import React, { CSSProperties } from "react"
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    defaultColumnOrder
      ? defaultColumnOrder
      : columns.filter(({ id }) => !!id).map(({ id }) => id ?? "")
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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
    visibilityState: Updater<VisibilityState>
  ) => {
    setColumnVisibility(visibilityState)
    onChangeColumnVisibility?.(visibilityState)
  }

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
          {
            <GripVerticalIcon
              size={16}
              className="opacity-0 hover:opacity-100"
              {...attributes}
              {...listeners}
            />
          }
        </div>
      </TableHead>
    )
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      columnOrder,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
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
