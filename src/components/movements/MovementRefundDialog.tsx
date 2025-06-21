"use client"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
} from "@/components/ui"
import InputAmount from "@/components/ui/InputAmount"
import { formatAmount } from "@/utils/data/utils"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
  open: boolean
  amountValue: number
  amountCurrency: string
  onOpenChange: (open: boolean) => void
  onRefound: (monto: number) => void
}

export function MovementRefundDialog({
  open,
  onOpenChange,
  amountValue,
  amountCurrency,
  onRefound,
}: Props) {
  const [amount, setAmount] = useState<number>(amountValue)

  const handleSubmit = () => {
    if (amount > 0 && amount <= amountValue) {
      onRefound(amount)
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
            // TODO: Connect InputAmount value state
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
            disabled={amount <= 0 || amount > amountValue}
          >
            <FormattedMessage id="refund" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
