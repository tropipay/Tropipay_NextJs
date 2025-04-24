"use client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
} from "@/components/ui"
import InputAmount from "@/components/InputAmount"
import { useState } from "react"
import { formatAmount } from "@/utils/data/utils"
import { FormattedMessage } from "react-intl"

type RefundDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  amountValue: number
  amountCurrency: string
  onReembolsar: (monto: number) => void
}

export function RefundDialog({
  open,
  onOpenChange,
  amountValue,
  amountCurrency,
  onReembolsar,
}: RefundDialogProps) {
  const [monto, setMonto] = useState<number>(amountValue)

  const handleSubmit = () => {
    if (monto > 0 && monto <= amountValue) {
      onReembolsar(monto)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">
            <FormattedMessage id="refund" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="monto" className="text-sm">
            <FormattedMessage id="enter_refund_amount" />
          </Label>
          <InputAmount
            id="monto"
            value={""}
            maxValue={Math.round(amountValue)}
            placeholder="0.00"
            className="text-left"
            action="max"
          />
          <p className="text-xs text-muted-foreground">
            <FormattedMessage id="you_can_refund_up_to" />{" "}
            <span className="text-primary font-medium">
              {formatAmount(amountValue, amountCurrency, "right")}
            </span>
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={monto <= 0 || monto > amountValue}
          >
            <FormattedMessage id="refund" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
