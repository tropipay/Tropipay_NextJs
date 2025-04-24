"use client"
import Validator2fa from "@/components/validator2fa"
import BookingStore from "@/stores/BookingStore"
import MarketProductStore from "@/stores/MarketProductStore"
import React, { useState } from "react"

const Page = () => {
  const [step, setStep] = React.useState("INITIAL")
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
        fn: (data) => console.log("validateCode", data),
        ok: "REFUND_OK",
        ko: "REFUND_KO",
        okFn: (obj) => {
          console.log("next step")
        },
      },
      cancel: () => console.log("cancel"),
    },
    data: {
      orderCode: 1111,
      amount: 222,
    },
  })

  if (step === "INITIAL") {
    return (
      <Validator2fa toSend={setDataTo2fa().toSend} data={setDataTo2fa().data} />
    )
  } else {
    return <div>{step}</div>
  }
}

export default Page
