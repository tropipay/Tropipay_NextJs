import React, { useEffect, useRef, useState } from "react"
import Countdown from "react-countdown"
import { USER, reactCodeInputStyles } from "../../../../plugins/utils"
import ErrorHandler from "../../../elements/errorHandler/ErrorHandler"
import ReactCodeInput from "react-code-input"
import use2FA from "../../../../hooks/use2FA"
import SimplePage from "../simplePage/SimplePage"

const local2fa = {
  SMS: 1,
  GOOGLE: 2,
  PIN: 3,
  MAIL: 100,
  PIN_TROPICARD: 101,
}

const Validator2fa = ({
  t,
  titleLabel = t("2fa.title"),
  className = "",
  classNameTitle = "fw500 fs20 text-center",
  classNameSubtitle = "",
  buttonResendLabel = t("2fa.buttons.resend"),
  buttonCancelLabel = t("2fa.buttons.cancel"),
  toSend,
  data,
}) => {
  const user = USER()
  const [expired, setExpired] = useState(false)

  const clearInput = () => {
    if (pinValue.current.textInput[0]) pinValue.current.textInput[0].focus()
    pinValue.current.state.input[0] = ""
    pinValue.current.state.input[1] = ""
    pinValue.current.state.input[2] = ""
    pinValue.current.state.input[3] = ""
    if (pinValue.current.state.input[4]) {
      pinValue.current.state.input[4] = ""
      pinValue.current.state.input[5] = ""
    }
  }

  const method = user?.twoFaType === local2fa.SMS ? "useSMS" : "useGoogle"
  const [finish, setFinish] = useState(false)

  const pinValue = useRef(null)
  const v2fa = use2FA({ ...toSend, data, clearInput })

  useEffect(() => {
    v2fa.setData(data)
  }, [])

  const renderTime = ({ minutes, seconds }) => {
    if (minutes === 0 && seconds === 0) {
      if (!expired) setExpired(true)
      return (
        <>
          {!v2fa.loading && (
            <div className="d-flex flex-nowrap align-items-center justify-content-center col-alert pt-5 mb-5">
              {t("Home.securityCodeExpired")}
            </div>
          )}
        </>
      )
    } else {
      if (expired) setExpired(false)
      return (
        <>
          <div className="d-flex flex-nowrap align-items-center justify-content-center colPri-form mb-5">
            <div className="text-center">
              {t("Home.expireTime")}:{" "}
              {minutes.toString().length === 1 ? `0${minutes}` : minutes}:
              {seconds.toString().length === 1 ? `0${seconds}` : seconds}
            </div>
          </div>
        </>
      )
    }
  }

  if (v2fa.inProcess && v2fa.errorState !== "PIN_DISABLED") {
    return (
      <SimplePage
        icon=""
        title={titleLabel}
        className={className}
        description={v2fa.messageLabel}
        classTitle={`${classNameTitle}`}
        classDescription={`${classNameSubtitle}`}
        loading={v2fa.loading}
        buttonBText={buttonCancelLabel}
        buttonBAction={v2fa.cancel}
        buttonAText={expired ? buttonResendLabel : ""}
        buttonAAction={() => {
          v2fa.sendCode()
          setFinish(false)
        }}
      >
        <div>
          <div className="login-form mt1 col-xs-12">
            <div className="text-center mb1">
              {!finish && (
                <ReactCodeInput
                  {...reactCodeInputStyles}
                  className={`ReactCodeInput d-flex justify-content-center align-items-center flex-nowrap ${
                    v2fa.twofa === local2fa.PIN ||
                    v2fa.twofa === local2fa.PIN_TROPICARD
                      ? "password-input"
                      : ""
                  }`}
                  id="securityCode"
                  type="number"
                  pattern="^[0-9]+$"
                  fields={
                    v2fa.twofa === local2fa.PIN ||
                    v2fa.twofa === local2fa.PIN_TROPICARD
                      ? 4
                      : 6
                  }
                  onChange={(securityCode) => {
                    if (v2fa.errorData) v2fa.setErrorData(null)
                    const lenght =
                      v2fa.twofa === local2fa.PIN ||
                      v2fa.twofa === local2fa.PIN_TROPICARD
                        ? 4
                        : 6
                    if (lenght === securityCode.length && !v2fa.loading) {
                      v2fa.sendVerifyCode(securityCode)
                    }
                  }}
                  key={v2fa.twofa}
                  ref={pinValue}
                  data-test-id="securityCode"
                  inputMode="numeric"
                />
              )}

              {v2fa.errorData?.response?.code.startsWith("INVALID_PIN") &&
                v2fa.errorState &&
                !finish && (
                  <p className="box210 error fs14 text-left mt-3">
                    {v2fa.twofa === local2fa.PIN && t(`2fa.incorrectPin`)}{" "}
                    {v2fa.twofa === local2fa.PIN &&
                      v2fa.errorState !== "INVALID_PIN1" && (
                        <span
                          className="colPri-prim pointer"
                          data-test-id="change-2fa-method"
                          onClick={() => {
                            v2fa.sendCode()
                            v2fa.resetMethod()
                          }}
                        >
                          {t(`2fa.pinError.alternativeMethod.${method}`)}
                        </span>
                      )}
                  </p>
                )}
            </div>
            <div className="text-right">
              <div className="text-left marginT1">
                {v2fa.twofa === local2fa.SMS && (
                  <Countdown
                    key={v2fa.countdown}
                    date={v2fa.countdown}
                    renderer={renderTime}
                    onComplete={() => setFinish(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ErrorHandler errorData={v2fa.errorData} key={"2fa"} />
      </SimplePage>
    )
  }
  if (v2fa.errorState === "PIN_DISABLED") {
    return (
      <SimplePage
        allTexts="2fa.pinError.removed"
        icon="error"
        buttonAAction={() => {
          v2fa.sendCode()
          v2fa.resetMethod()
        }}
        buttonBAction={() => {
          user.twoFaType = USER().twoFaType
          v2fa.cancel()
        }}
      />
    )
  }
}

export default Validator2fa
