import { cn } from "@/utils/data/utils"
import * as React from "react"

// Definimos una interfaz para RowData (ajústala según tus necesidades)
interface RowData {
  id: number
  name: string
  // ... otras propiedades
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [scrollLeft, setScrollLeft] = React.useState(0)
  const [hasHorizontalScroll, setHasHorizontalScroll] = React.useState(false)

  // Función para verificar si hay scroll horizontal
  const checkHorizontalScroll = () => {
    if (tableContainerRef.current) {
      const { scrollWidth, clientWidth } = tableContainerRef.current
      setHasHorizontalScroll(scrollWidth > clientWidth)
    }
  }

  // Verificar el scroll horizontal al montar y al redimensionar
  React.useEffect(() => {
    checkHorizontalScroll()
    window.addEventListener("resize", checkHorizontalScroll)
    return () => window.removeEventListener("resize", checkHorizontalScroll)
  }, [])

  // Verificar el scroll horizontal cuando cambie el contenido
  React.useEffect(() => {
    checkHorizontalScroll()
  }, [props.children])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tableContainerRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - tableContainerRef.current.offsetLeft)
      setScrollLeft(tableContainerRef.current.scrollLeft)
    }
  }

  /*   const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  } */

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tableContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - tableContainerRef.current.offsetLeft
    const walk = (x - startX) * 1 // Velocidad del scroll
    tableContainerRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div
      ref={tableContainerRef}
      className={cn(
        "relative w-full overflow-auto tableContainer",
        "select-none",
        {
          "cursor-grabbing": isDragging,
          "cursor-grab": !isDragging,
        }
      )}
      style={{
        scrollBehavior: "auto",
        whiteSpace: "nowrap",
        maxHeight: "calc(84vh - 100px)",
      }}
      onMouseDown={handleMouseDown}
      /*       onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
 */
    >
      <table
        ref={ref}
        className={cn("relative w-full caption-bottom text-sm", className)}
        {...props}
      />
      {/*       {hasHorizontalScroll && (
        <SwipeAnimation key={hasHorizontalScroll.toString()} />
      )} */}
    </div>
  )
})

Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    rowData?: any
    onRowClick?: (rowData: RowData) => void
  }
>(({ className, rowData, onRowClick, ...props }, ref) => {
  const [isDraggingRow, setIsDraggingRow] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [moved, setMoved] = React.useState(false)

  const DRAG_THRESHOLD = 5

  const handleMouseDown = (e: React.MouseEvent<HTMLTableRowElement>) => {
    setIsDraggingRow(true)
    setStartX(e.pageX)
    setMoved(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (isDraggingRow) {
      const distance = Math.abs(e.pageX - startX)
      if (distance > DRAG_THRESHOLD) {
        setMoved(true)
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (isDraggingRow && !moved && onRowClick && rowData) {
      onRowClick(rowData)
    }
    setIsDraggingRow(false)
    setMoved(false)
  }

  const handleMouseLeave = () => {
    setIsDraggingRow(false)
    setMoved(false)
  }

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "z-30 h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
