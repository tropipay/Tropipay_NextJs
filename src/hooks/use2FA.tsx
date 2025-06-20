/**
 * 
 * @param {Object[]} sendCode - Objeto que contiene la información necesaria para el envío del 2fa
 * sendCode:
  - store: store relacionado con la siguiente fn
  - fn: Función del action que lanza el 2fa
  - ok: evento Ok en el listener
  - ko: evento Ko en el listener
  - okFn: función a ejecutarse al completarse el envío del código
  * @param {Object[]} validateCode - Objeto que contiene la información necesaria para la validación del 2fa
  * validateCode:
  - store: store relacionado con la siguiente fn
  - fn: Función del action que valida el 2fa
  - ok: evento Ok en el listener
  - ko: evento Ko en el listener
  - okFn: función a ejecutarse al completarse el proceso con el envío del 2fa
  * @param {number} totalTime - Tiempo de validez del código 2fa (por defecto 300000 => 5min)
  * @param {functoin} cancel - Evento a lanzarse tras la cancelación del proceso de validación
  * @param {string} invalidCodeMessage - Mensaje de error al ingresar un codigo con formato incorrecto; Devolverá este mensaje de error sin llamar al endpoint.
 * @returns 
    sendCode: Función para comenzar el proceso de 2fa
    sendVerifyCode: sendVerifyCodeFn,
    cancel,
    countdown,
    twofa,
    time,
    loading,
    setInProcess,
    inProcess,
    errorData,
    updateFns,
    setData
 */
"use client"

import PinStore from "@/stores/PinStore"
import { errorGenerator } from "@/utils/data/utils"
import { twoFaEndpointList, twoFaTypes } from "@/utils/enums"
import { getUserStore } from "@/utils/user/utilsUser"
import { useEffect, useState } from "react"

const local2fa = {
  SMS: 1,
  GOOGLE: 2,
  PIN: 3,
  MAIL: 100,
  PIN_TROPICARD: 101,
}
// Updated keys for local2faMessages
const local2faMessages = {
  [local2fa.SMS]: "sms_description",
  [local2fa.GOOGLE]: "google_auth_description",
  [local2fa.PIN]: "pin_description",
  [local2fa.MAIL]: "email_description",
  [local2fa.PIN_TROPICARD]: "tropicard_pin_description",
}

const use2FA = (props) => {
  const {
    sendCode,
    validateCode,
    data,
    time = 300000,
    cancel,
    clearInput,
  } = props

  const fns = {
    sendCode,
    validateCode,
    cancel,
  }

  const codeName = props.codeName || "securityCode"
  const user = getUserStore()
  const use2fa =
    user?.activePin && twoFaEndpointList[fns.validateCode.ok]
      ? local2fa.PIN
      : user?.twoFaType
  const [twofa, setTwofa] = useState(props.twofa || use2fa)
  const [messageLabelKey, setMessageLabelKey] = useState(
    local2faMessages[twofa]
  )

  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [inProcess, setInProcess] = useState(false)
  const [errorData, setErrorData] = useState<any | null>(null)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [Data, setData] = useState(data)

  const t = (key) => {
    return key
  }

  const pinListener = (obj) => {
    const actions = {
      PIN_DAILYLIMIT_OK: (obj) => {
        if (obj.result.data.available) {
          setTwofa(local2fa.PIN)
          setInProcess(true)
        } else {
          setTwofa(user?.twoFaType || local2fa.SMS)
          sendCodeFn()
        }
      },
    }
    actions[obj.type] && actions[obj.type](obj)
    if (obj.type.endsWith("_KO")) {
      if (!actions[obj.type]) setErrorData(obj)
    }
  }

  const errorHandler = (obj) => {
    // CONSULTA POR ERROR CON PIN ACTIVO
    setErrorData(obj)
    if (obj.type === fns.validateCode?.ko) {
      // Check if response code exists before setting error state
      if (obj.response?.code && obj.response.code !== "INVALID_CODE") {
        setErrorState(obj.response.code)
        if (obj.response.code === "PIN_DISABLED") {
          // ProfileStore.profile.activePin = false // Commented out: Direct store modification is likely incorrect. Needs proper state update logic.
          if (user) user.activePin = false // Check if user exists before modifying
          setTwofa(user?.twoFaType || local2fa.SMS) // Check user and provide default
        }
      } else {
        setErrorState(null) // Reset error state if code is invalid or missing
      }
    }
    // LIMPIAR CAJA DE INGRESO CLAVE/PIN
    if (obj?.response?.type === "VALIDATION_ERROR") {
      // CAMBIAR EL IFFFFFFFF
      fns.validateCode?.koFn && fns.validateCode?.koFn(obj)
    } else {
      clearInput()
    }
  }

  const resetMethod = () => {
    const resetTwofaType = user?.twoFaType || local2fa.SMS // Default to SMS if user type is undefined
    setTwofa(resetTwofaType)
    setMessageLabelKey(local2faMessages[resetTwofaType] || "sms_description") // Update message key on reset, add fallback
    setErrorState(null)
    setErrorData(null)
  }

  // eslint-disable-next-line
  let objectStore
  const listenerSendCode = (obj) => {
    objectStore()
    setLoading(false)
    // CODIGO ENVIADO
    if (fns.sendCode?.ok === obj.type) {
      setErrorState(null)
      setInProcess(true)
      setCountdown(Date.now() + time + 1)
      fns.sendCode?.okFn && fns.sendCode?.okFn(obj)
    } else if (obj.type === fns.sendCode?.ko) {
      // CODIGO INVALIDO
      setErrorData(obj)
    } else {
      setErrorState(null)
      setErrorData(null)
    }
  }
  const listenerValidationCode = (obj) => {
    objectStore()
    setLoading(false)
    // CODIGO ENVIADO
    if (fns.validateCode?.ok === obj.type) {
      // CODIGO VALIDADO
      setErrorState(null)
      setInProcess(false)
      fns.validateCode?.okFn && fns.validateCode?.okFn(obj)
    } else if (obj.type === fns.validateCode?.ko) {
      errorHandler(obj)
    } else {
      setErrorState(null)
      setErrorData(null)
    }
  }

  const setPayload = (validateCode) => {
    const payload = {
      amount: Data.amount,
      baseUrl: twoFaEndpointList[validateCode.ok],
    }
    return payload
  }

  useEffect(() => {
    let Pin
    const payload = setPayload(fns.validateCode)
    // Ensure user exists before checking activePin
    if (user?.activePin && payload.baseUrl) {
      Pin = PinStore.listen(pinListener, "use2FA")
      PinStore.DailyLimit(payload)
    } else {
      // Ensure user exists before accessing twoFaType, provide default
      setTwofa(user?.twoFaType || local2fa.SMS)
      // Update message label key based on the potentially updated twofa state
      setMessageLabelKey(
        local2faMessages[user?.twoFaType || local2fa.SMS] || "sms_description"
      )
      sendCodeFn()
    }
    return () => {
      if (objectStore) {
        objectStore()
      }
      Pin && Pin()
    }
  }, [])

  useEffect(() => {
    if (props.twofa) setTwofa(props.twofa)
  }, [props.twofa])

  useEffect(() => {
    setMessageLabelKey(local2faMessages[twofa]) // Update the key when twofa changes
  }, [twofa])

  // Esta función inicia todo el proceso de validación del 2FA al lanza el envío del sms
  const sendCodeFn = (data = null) => {
    if (twofa === twoFaTypes.SMS && fns.sendCode?.fn) {
      setErrorData(null)
      objectStore = fns.sendCode.store.listen(listenerSendCode, "use2FA")
      setLoading(true)
      setCountdown(0)
      fns.sendCode.fn()
    } else {
      setCountdown(Date.now() + time)
    }
    setInProcess(true)
  }
  // Lanza la validación del securityCode
  const sendVerifyCodeFn = (code, anotherParams = null) => {
    const codeLenght =
      twofa === local2fa.PIN || twofa === local2fa.PIN_TROPICARD ? 4 : 6
    if (
      // Pass the key to errorGenerator, assuming translation happens there or later
      errorGenerator({
        setErrorData,
        condition: code.length !== codeLenght,
        message: messageLabelKey, // Pass the key instead of translated message
      })
    )
      return null
    setErrorData(null)
    objectStore = fns.validateCode.store.listen(
      listenerValidationCode,
      "use2FA"
    )
    let newData = { [codeName]: code }
    newData = { ...Data, ...newData }
    let arrayData = [newData]
    if (fns.validateCode.aditionalData) {
      arrayData = [...arrayData, ...fns.validateCode.aditionalData]
    }
    setLoading(true)
    fns.validateCode.fn(...arrayData)
  }
  // Cancela el proceso de validación
  const cancelFn = () => {
    setInProcess(false)
    if (fns.cancel) fns.cancel()
  }
  const returnObject = {
    sendCode: sendCodeFn,
    sendVerifyCode: sendVerifyCodeFn,
    cancel: cancelFn,
    countdown,
    twofa,
    loading,
    inProcess,
    errorData,
    setErrorData,
    setData,
    messageLabel: messageLabelKey, // Return the key
    resetMethod,
    errorState,
  }
  return returnObject
}

export default use2FA
