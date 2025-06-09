import { Button, DialogHeader, DialogTitle, Label } from "@/components/ui"
import InputAmount from "@/components/ui/InputAmount"
import { formatAmount } from "@/utils/data/utils"
import React from "react"
import { FormattedMessage } from "react-intl"

const Step0_DefineAmount = ({ data, setData, next }) => {
  const { amountValue, amountCurrency } = data
  const [amount, setAmount] = React.useState("")

  const handleContinue = () => {
    setData({ amount })
    next()
  }

  return (
    <>
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
          maxValue={Math.round(amountValue)}
          placeholder="0.00"
          className="text-left"
          action="max"
          onChange={(value) => setAmount(value)}
        />
        <p className="text-xs text-muted-foreground">
          <FormattedMessage id="you_can_refund_up_to" />{" "}
          <span className="text-primary font-medium">
            {formatAmount(amountValue, amountCurrency, "right")}
          </span>
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => data.onOpenChange(false)}>
          <FormattedMessage id="cancel" />
        </Button>
        <Button
          onClick={() => {
            if (parseFloat(amount) > 0) {
              handleContinue()
            }
          }}
          disabled={parseFloat(amount) <= 0}
        >
          <FormattedMessage id="refund" />
        </Button>
      </div>
    </>
  )
}

export default Step0_DefineAmount
