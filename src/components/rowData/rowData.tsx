import { cn } from "@/lib/utils"

export function RowData({ label, value, style }) {
  return (
    <div
      className={cn(
        "flex justify-between px-4 py-2 text-sm",
        style === "header" && "border-b text-gray-500 font-medium p-5",
        style === "row" && "border-b border-gray-200 p-5",
        style === "resume" && "bg-gray-200 font-semibold p-5"
      )}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
