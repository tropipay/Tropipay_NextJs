import React from "react"
import { Button, DialogHeader, DialogTitle } from "@/components/ui"
import { FormattedMessage } from "react-intl"

const Step3_RefundError = (props) => {
  const { fullData, onFinish } = props
  const { step0: data0, step1: data1 } = fullData

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">
          <FormattedMessage id="refund_failed" />
        </DialogTitle>
      </DialogHeader>
      <p className="text-xs text-muted-foreground">
        <FormattedMessage id="refund_processing_error" />
      </p>
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onFinish}>
          <FormattedMessage id="done" />
        </Button>
      </div>
    </>
  )
}

export default Step3_RefundError
