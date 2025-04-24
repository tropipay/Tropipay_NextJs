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
import ProfileStore from "@/stores/ProfileStore"
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
const local2faMessages = {
  1: "2fa.messages.descriptionSms",
  2: "2fa.messages.descriptionGoogle",
  3: "2fa.messages.descriptionPin",
  100: "2fa.messages.descriptionEmail",
  101: "2fa.messages.descriptionPinTropiCard",
}

const use2FA = (props) => {
  const {
    sendCode,
    validateCode,
    data,
    time = 3000,
    cancel,
    clearInput,
  } = props

  const fns = {
    sendCode,
    validateCode,
    cancel,
  }

  // Si tiene el pin activo el 2fa será el PIN, caso contraro será el que traiga asignado el usuario
  const codeName = props.codeName || "securityCode"
  const user = getUserStore()
  const use2fa =
    user?.activePin && twoFaEndpointList[fns.validateCode.ok]
      ? local2fa.PIN
      : user?.twoFaType
  const [twofa, setTwofa] = useState(props.twofa || use2fa)
  const [messageLabel, setMessageLabel] = useState(local2faMessages[twofa])

  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [inProcess, setInProcess] = useState(false)
  const [errorData, setErrorData] = useState(null)
  const [errorState, setErrorState] = useState(null)
  const [Data, setData] = useState(data)

  const t = (key) => {
    return key
  }

  // VALIDACION EXCLUSIVA PARA COMPRAS CON PIN
  const pinListener = (obj) => {
    const actions = {
      PIN_DAILYLIMIT_OK: (obj) => {
        if (obj.result.data.available) {
          setTwofa(local2fa.PIN)
          setInProcess(true)
        } else {
          setTwofa(user.twoFaType)
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
      setErrorState(null)
      if (obj.response.code !== "INVALID_CODE") {
        setErrorState(obj.response.code)
        if (obj.response.code === "PIN_DISABLED") {
          ProfileStore.profile.activePin = false
          user.activePin = false
          setTwofa(user.twoFaType)
        }
      }
    }
    // LIMPIAR CAJA DE INGRESO CLAVE/PIN
    if (obj.response.type === "VALIDATION_ERROR") {
      clearInput()
    } else {
      fns.validateCode?.koFn && fns.validateCode?.koFn(obj)
    }
  }

  const resetMethod = () => {
    setTwofa(user.twoFaType)
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
    if (user?.activePin && payload.baseUrl) {
      Pin = PinStore.listen(pinListener)
      PinStore.DailyLimit(payload)
    } else {
      setTwofa(user?.twoFaType)
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
    setMessageLabel(local2faMessages[twofa])
  }, [twofa])

  // Esta función inicia todo el proceso de validación del 2FA al lanza el envío del sms
  const sendCodeFn = (data = null) => {
    if (twofa === twoFaTypes.SMS && fns.sendCode?.fn) {
      setErrorData(null)
      objectStore = fns.sendCode.store.listen(listenerSendCode)
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
      errorGenerator({
        setErrorData,
        condition: code.length !== codeLenght,
        message: t(messageLabel),
      })
    )
      return null
    setErrorData(null)
    objectStore = fns.validateCode.store.listen(listenerValidationCode)
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
    messageLabel,
    resetMethod,
    errorState,
  }
  return returnObject
}

export default use2FA
