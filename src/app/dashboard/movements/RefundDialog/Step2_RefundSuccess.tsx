import React from "react"
import { Button, DialogHeader, DialogTitle, Label } from "@/components/ui"
import { FormattedMessage } from "react-intl"
import { formatAmount } from "@/utils/data/utils"

const Step2_RefundSuccess = (props) => {
  const { fullData, onFinish } = props
  const { step0: data0 } = fullData

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">Reembolso realizado</DialogTitle>
      </DialogHeader>
      <p className="text-xs text-muted-foreground">
        Reembolsamos{" "}
        <span className="text-primary font-medium">
          {data0.amount + " " + data0.amountCurrency}
        </span>
      </p>{" "}
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onFinish}>Listo</Button>
      </div>
    </>
  )
}

export default Step2_RefundSuccess
