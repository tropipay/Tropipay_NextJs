import DestinationCountryStore from "@/stores/DestinationCountryStore"
import React, { useState } from "react"

const Page = () => {
  const [step, setStep] = React.useState("INITIAL")
  const setDataTo2fa = () => {
    let toSend = {
      cancel: () => {
        setStep("CANCEL")
      },
      validateCode: null,
    }
    const data = {
      amount: 111111,
      paymentcardId: 2222,
    }
    const validateCode = {
      store: DestinationCountryStore,
      fn: DestinationCountryStore.List,
      ok: "DESTINATION_COUNTRY_LIST_OK",
      ko: "DESTINATION_COUNTRY_LIST_KO",
      okFn: (obj) => {
        setStep("OK")
      },
      koFn: (obj) => {
        setStep("KO")
      },
    }
    toSend = {
      ...toSend,
      validateCode,
    }
    return { toSend, data }
  }

  if (step === "INITIAL") {
    return (
      <Validator2fa toSend={setDataTo2fa().toSend} data={setDataTo2fa().data} />
    )
  } else {
    return <div>{step}</div>
  }
}

export default Page
