import { cn } from "@/lib/utils"

export function RowData({ label, value, style }) {
  return (
    <div
      className={cn(
        "report-content-row flex items-center justify-between px-4 p-5 text-sm",
        style === "header" && "border-b text-gray-500 font-medium",
        style === "row" && "border-b border-gray-200",
        style === "resume" && "bg-gray-200 font-semibold"
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
