import {
  Header,
} from "@tanstack/react-table"
import { CSSProperties } from "react"
import {
  TableHead,
} from "@/components/ui"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon } from "lucide-react"
import { flexRender } from "@tanstack/react-table"

interface DraggableTableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
}

/**
 * Draggable Table Header Component
 *
 * This component renders a draggable table header with drag and drop functionalities.
 */
const DraggableTableHeader = <TData, TValue>({
  header,
}: DraggableTableHeaderProps<TData, TValue>) => {
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
      data-test-id={`dataTable-tableHead-sortBy-${header.id}`}
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

export default DraggableTableHeader;
