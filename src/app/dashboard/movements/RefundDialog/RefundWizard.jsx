import React from "react"
import { Dialog, DialogContent } from "@/components/ui"
import MultiStepWizard from "../../../../components/multiStepper/MultiStepWizard"
import Step0_DefineAmount from "./Step0_DefineAmount"
import Step1_GetSecurityCode from "./Step1_GetSecurityCode"
import Step2_RefundSuccess from "./Step2_RefundSuccess"
import Step3_RefundError from "./Step3_RefundError"

export const RefundWizard = ({
  open,
  onOpenChange,
  orderCode,
  amountValue,
  amountCurrency,
}) => {
  const steps = [
    Step0_DefineAmount,
    Step1_GetSecurityCode,
    Step2_RefundSuccess,
    Step3_RefundError,
  ]

  const handleFinish = (data) => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <MultiStepWizard
          steps={steps}
          initialData={{
            step0: {
              onOpenChange,
              orderCode,
              amountValue,
              amountCurrency,
            },
          }}
          onFinish={handleFinish}
        />
      </DialogContent>
    </Dialog>
  )
}
