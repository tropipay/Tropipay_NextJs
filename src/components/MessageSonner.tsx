import { useTranslations } from "@/utils/intl"
import { useEffect } from "react"
import { toast } from "sonner"

function getApiErrorMessage(
  t,
  obj,
  defaultKey = "CONNECTION_ERROR.RETRY_LATER"
) {
  console.log("error xxxxxxxxxxxxxxxxx:", obj)
  if (!obj?.data?.error) {
    return t(defaultKey)
  }

  const { i18n, details } = obj.data.error
  return details?.length
    ? details[0].i18n || i18n || t(defaultKey)
    : i18n || t(defaultKey)
}

const MessageSonner = ({ errorData, setErrorData }) => {
  const { t } = useTranslations()

  useEffect(() => {
    if (!errorData) return
    const isError =
      errorData.type.includes("error") ||
      errorData.type.includes("_KO") ||
      errorData.type.includes("_ERROR")

    try {
      const message = getApiErrorMessage(t, errorData)
      console.log("message:", message)
      console.log("isError:", isError)
      console.log("isError:", errorData)
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

export default MessageSonner
