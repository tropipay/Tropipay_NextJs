import { useTranslations } from "@/utils/intl"
import { useEffect } from "react"
import { toast } from "sonner"

function getApiErrorMessage(
  t,
  error,
  defaultKey = "CONNECTION_ERROR.RETRY_LATER"
) {
  if (!error?.response?.data?.error) {
    return t(defaultKey)
  }

  const { i18n, details } = error.response.data.error
  return details?.length
    ? details[0].i18n || i18n || t(defaultKey)
    : i18n || t(defaultKey)
}

const ErrorHandlerToast = ({ errorData, setErrorData }) => {
  const { t } = useTranslations()

  useEffect(() => {
    if (!errorData?.payload?.error) return

    const isError =
      errorData.type.includes("error") ||
      errorData.type.includes("_KO") ||
      errorData.type.includes("_ERROR")

    try {
      const message = getApiErrorMessage(t, errorData.payload.error)

      if (isError) {
        toast.error("Error", {
          description: message,
          onAutoClose: () => setErrorData(null),
        })
      } else {
        toast.success(t("success"), {
          description: message,
          onAutoClose: () => setErrorData(null),
        })
      }
    } catch (err) {
      toast.error(t("error"), { description: t("UNKNOWN_ERROR") })
    }
  }, [errorData, t])

  return null
}

export default ErrorHandlerToast
