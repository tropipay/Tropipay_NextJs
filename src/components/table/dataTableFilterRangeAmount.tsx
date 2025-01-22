import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import useFiltersManager from "@/hooks/useFiltersManager"
import { formatAmount, selStyle } from "@/lib/utils"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { Column } from "@tanstack/react-table"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "../intl/useTranslation"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import InputAmount from "../inputAmount"

interface DataTableFilterRangeAmountProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableFilterRangeAmount<TData, TValue>({
  column,
}: DataTableFilterRangeAmountProps<TData, TValue>) {
  const { t } = useTranslation()
  const label = (column as any)?.filter?.label
  const { initialSelected, values, updateValues, onSubmit, setParams } =
    useFiltersManager({
      column,
    })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selStyle(
            initialSelected?.min || initialSelected?.max,
            "active",
            "inactive",
            ""
          )}
          size="sm"
          className="px-2 h-8"
        >
          {label}
          {initialSelected?.min || initialSelected?.max ? (
            <>
              <Separator orientation="vertical" className="h-4 separator" />
              {initialSelected?.min && initialSelected?.max
                ? `${formatAmount(
                    initialSelected.min * 100,
                    "EUR",
                    "right"
                  )} - ${formatAmount(
                    initialSelected.max * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              {initialSelected?.min && !initialSelected?.max
                ? `Desde ${formatAmount(
                    initialSelected.min * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              {!initialSelected?.min && initialSelected?.max * 100
                ? `Hasta ${formatAmount(
                    initialSelected.max * 100,
                    "EUR",
                    "right"
                  )}`
                : null}
              <div
                onClick={(event) => {
                  event.stopPropagation()
                  setParams({ [column?.id ?? ""]: null })
                }}
              >
                <CrossCircledIcon className="h-4 w-4" />
              </div>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <form onSubmit={onSubmit}>
          <div className="pb-4">
            <Label htmlFor="width" className="font-bold">
              {label}
            </Label>
          </div>
          <Label htmlFor="width">
            <FormattedMessage id="from" />
          </Label>
          <InputAmount
            id="min"
            className="my-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} mín`}
            value={values.min || ""}
            onChange={updateValues}
          />
          <Label htmlFor="width">
            <FormattedMessage id="to" />
          </Label>
          <InputAmount
            id="max"
            className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={`${label} máx`}
            value={values.max || ""}
            onChange={updateValues}
          />
          <PopoverClose asChild>
            <div className="py-2">
              <PopoverClose asChild>
                <Button
                  variant="default"
                  className="bg-blue-600 text-white w-full"
                  type="submit"
                >
                  {<FormattedMessage id="apply" />}
                </Button>
              </PopoverClose>
            </div>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
