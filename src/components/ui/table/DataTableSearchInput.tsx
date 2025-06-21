import { Input } from "@/components/ui/Input"
import { cn } from "@/utils/data/utils"
import { Search } from "lucide-react"
import { useTranslation } from "../../intl/useTranslation"

interface Props {
  className?: string
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  searchParamValue: string
}

export const DataTableSearchInput: React.FC<Props> = ({
  className,
  handleSearchChange,
  searchParamValue,
}) => {
  const { t } = useTranslation()
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <span className="absolute left-3 top-[10px] flex items-center text-gray-500">
        <Search className="h-5 w-5" aria-hidden="true" />
      </span>
      <Input
        id="search"
        type="search"
        placeholder={t("search")}
        onChange={handleSearchChange}
        className="pl-10 w-full"
        defaultValue={searchParamValue}
        data-test-id="dataTableToolbar-input-search" // Updated data-test-id
      />
    </div>
  )
}
