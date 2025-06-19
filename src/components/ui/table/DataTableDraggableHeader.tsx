import { TableHead } from "@/components/ui"
import { cn } from "@/utils/data/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { flexRender, Header } from "@tanstack/react-table"
import { CSSProperties, ReactNode } from "react"

interface Props<TData, TValue> {
  header: Header<TData, TValue>
  actions?: ReactNode
}

/**
 * Draggable Table Header Component
 *
 * This component renders a draggable table header with drag and drop functionalities.
 */
const DataTableDraggableHeader = <TData, TValue>({
  header,
  actions,
}: Props<TData, TValue>) => {
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
      style={style}
      data-test-id={`dataTable-tableHead-sortBy-${header.id}`}
      className={cn(
        "sticky top-0 border-b-1 border-gray-500 bg-white whitespace-nowrap cursor-default",
        "cursor-grab",
        isDragging && "cursor-grabbing"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-1 items-center">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {actions}
      </div>
    </TableHead>
  )
}

export default DataTableDraggableHeader
