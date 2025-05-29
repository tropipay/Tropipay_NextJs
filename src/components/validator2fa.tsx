"use client"
import ErrorHandler from "@/components/ErrorHandler"
import SimplePage from "@/components/simplePage/simplePage"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import use2AF from "@/hooks/use2AF"
import { cn } from "@/utils/data/utils"
import { getUserStore } from "@/utils/user/utilsUser"
import { useEffect, useState } from "react"
import Countdown from "react-countdown"
import { useIntl } from "react-intl"

// Define a type for the expected error structure
interface ApiError {
  response?: {
    code?: string
    message?: string
  }
}

const local2fa = {
  SMS: 1,
  GOOGLE: 2,
  PIN: 3,
  MAIL: 100,
  PIN_TROPICARD: 101,
}

const Validator2fa = ({
  titleLabel = "twofa_title",
  className = "",
  classNameTitle = "text-left mb-4 font-bold",
  classNameSubtitle = "font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-left mb-2",
  buttonResendLabel = "resend_code",
  buttonCancelLabel = "cancel",
  toSend,
  data,
}) => {
  const intl = useIntl() // Get intl object
  const user = getUserStore() // Corrected function call
  const [expired, setExpired] = useState(false)
  const [otpValue, setOtpValue] = useState("")

  const clearInput = () => {
    setOtpValue("")
  }

  const method = user?.twoFaType === local2fa.SMS ? "useSMS" : "useGoogle"
  const [finish, setFinish] = useState(false)

  const v2fa = use2AF({ ...toSend, data, clearInput })

  useEffect(() => {
    v2fa.setData(data)
  }, [])

  const renderTime = ({ minutes, seconds }) => {
    if (minutes === 0 && seconds === 0) {
      if (!expired) setExpired(true)
      return (
        <>
          {!v2fa.loading && (
            <div className="d-flex flex-nowrap align-items-center justify-content-center col-alert pt-5 ">
              {intl.formatMessage({ id: "code_expired" })}{" "}
            </div>
          )}
        </>
      )
    } else {
      if (expired) setExpired(false)
      return (
        <>
          <div className="d-flex flex-nowrap align-items-center justify-content-center colPri-form">
            <div className="text-center font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm mt-3">
              {intl.formatMessage({ id: "expires_in" })}:{" "}
              {/* Use formatMessage */}
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
        title={intl.formatMessage({ id: titleLabel })}
        className={className}
        description={intl.formatMessage({ id: v2fa.messageLabel })} // Use formatMessage
        classTitle={`${classNameTitle}`}
        classDescription={`${classNameSubtitle}`}
        loading={v2fa.loading}
        buttonBText={intl.formatMessage({ id: buttonCancelLabel })} // Use formatMessage
        buttonBAction={v2fa.cancel}
        buttonAText={
          expired ? intl.formatMessage({ id: buttonResendLabel }) : ""
        } // Use formatMessage
        buttonsDisposition="horizontal"
        buttonAAction={() => {
          v2fa.sendCode()
          setFinish(false)
        }}
      >
        <div>
          <div className="login-form mt1 col-xs-12">
            <div className="text-center mb1">
              {!finish && (
                <InputOTP
                  autoFocus
                  maxLength={
                    v2fa.twofa === local2fa.PIN ||
                    v2fa.twofa === local2fa.PIN_TROPICARD
                      ? 4
                      : 6
                  }
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value)
                    if (v2fa.errorData) v2fa.setErrorData(null)
                  }}
                  onComplete={(value) => {
                    if (!v2fa.loading) {
                      v2fa.sendVerifyCode(value)
                    }
                  }}
                  key={v2fa.twofa} // Keep key for potential re-renders on method change
                  data-test-id="securityCode"
                  inputMode="numeric" // Ensure numeric keyboard on mobile
                  pattern="^[0-9]+$" // Basic pattern validation
                >
                  <InputOTPGroup
                    className={cn(
                      "d-flex justify-content-center align-items-center flex-nowrap mx-auto",
                      v2fa.twofa === local2fa.PIN ||
                        v2fa.twofa === local2fa.PIN_TROPICARD
                        ? "password-input" // Apply specific style if needed
                        : ""
                    )}
                  >
                    {Array.from({
                      length:
                        v2fa.twofa === local2fa.PIN ||
                        v2fa.twofa === local2fa.PIN_TROPICARD
                          ? 4
                          : 6,
                    }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}

              {/* Check with type assertion */}
              {v2fa.errorData &&
                (v2fa.errorData as ApiError).response &&
                typeof (v2fa.errorData as ApiError).response?.code ===
                  "string" &&
                (v2fa.errorData as ApiError).response?.code?.startsWith(
                  "INVALID_PIN"
                ) &&
                v2fa.errorState &&
                !finish && (
                  <p className="box210 error fs14 text-left mt-3">
                    {v2fa.twofa === local2fa.PIN &&
                      intl.formatMessage({ id: "incorrect_pin" })}{" "}
                    {/* Use formatMessage */}
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
                          {intl.formatMessage({
                            id:
                              method === "useSMS"
                                ? "use_sms"
                                : "use_google_auth",
                          })}{" "}
                          {/* Use formatMessage with conditional id */}
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
        <ErrorHandler
          errors={
            v2fa.errorData
              ? [
                  // Check with type assertion
                  ((v2fa.errorData as ApiError).response &&
                    (v2fa.errorData as ApiError).response?.message) ||
                    ((v2fa.errorData as ApiError).response &&
                      (v2fa.errorData as ApiError).response?.code) ||
                    (typeof v2fa.errorData === "string"
                      ? v2fa.errorData
                      : "Unknown error"),
                ]
              : []
          }
          key={"2fa"}
        />
      </SimplePage>
    )
  }
  if (v2fa.errorState === "PIN_DISABLED") {
    // Use intl.formatMessage for props expecting strings
    return (
      <SimplePage
        title={intl.formatMessage({ id: "max_attempts_title" })}
        description={intl.formatMessage({ id: "max_attempts_desc" })}
        icon="error"
        buttonAText={intl.formatMessage({ id: "continue" })}
        buttonAAction={() => {
          v2fa.sendCode()
          v2fa.resetMethod()
        }}
        buttonBText={intl.formatMessage({ id: "cancel" })}
        buttonBAction={() => {
          // Assuming getUser() returns an object where twoFaType can be set.
          // If getUser() returns undefined initially, this might need adjustment
          // or ensuring user profile is loaded before this component renders.
          const currentUser = getUserStore()
          if (currentUser) {
            // Note: Modifying the object returned by getUser() might not update the source
            // depending on how state management is set up.
            // Consider if a dedicated action/setter is needed.
            // For now, mimicking the original logic.
            // user.twoFaType = currentUser.twoFaType // This line seems problematic, user is const
          }
          // Re-fetch original user data if needed, or rely on state management update
          // The original logic USER().twoFaType likely fetched fresh data.
          // Let's keep the cancel action for now.
          v2fa.cancel()
        }}
      />
    )
  }
}

export default Validator2fa
