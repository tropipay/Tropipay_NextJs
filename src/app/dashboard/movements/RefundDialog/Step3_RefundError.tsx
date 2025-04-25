import React from "react"
import { Button, DialogHeader, DialogTitle } from "@/components/ui"

const Step3_RefundError = (props) => {
  const { fullData, onFinish } = props
  const { step0: data0, step1: data1 } = fullData

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">Reembolso fallido</DialogTitle>
      </DialogHeader>
      <p className="text-xs text-muted-foreground">
        Hubo un error al procesar el reembolso, por favor intenta más tarde.
      </p>
      <div className="flex justify-end gap-2 pt-4">
        <Button onClick={onFinish}>Listo</Button>
      </div>
    </>
  )
}

export default Step3_RefundError
