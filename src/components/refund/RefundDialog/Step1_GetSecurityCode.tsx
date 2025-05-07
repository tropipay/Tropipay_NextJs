import React from "react"
import Validator2fa from "@/components/validator2fa"
import BookingStore from "@/stores/BookingStore"

const Step1_GetSecurityCode = (props) => {
  const { fullData, next } = props
  const { step0: data } = fullData

  const handleContinue = () => {
    next()
  }

  const setDataTo2fa = () => ({
    toSend: {
      sendCode: {
        store: BookingStore,
        fn: BookingStore.SendSecurityCode,
        ok: "SEND_SECURITY_CODE_TRANSFER_OK",
        ko: "SEND_SECURITY_CODE_TRANSFER_KO",
      },
      validateCode: {
        store: BookingStore,
        fn: BookingStore.Refund,
        ok: "REFUND_OK",
        ko: "REFUND_KO",
        okFn: (obj) => {
          console.log("OK")
          props.next()
        },
        koFn: (obj) => {
          console.log("KO")
          props.setStep(3)
        },
      },
      cancel: props.prev,
    },
    data: {
      orderCode: data.orderCode,
      amount: data.amount * 100,
    },
  })

  return (
    <Validator2fa toSend={setDataTo2fa().toSend} data={setDataTo2fa().data} />
  )
}

export default Step1_GetSecurityCode
