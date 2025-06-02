import { useIntl } from "react-intl"

export function useTranslations() {
  const intl = useIntl()

  const t = (id: string, values?: Record<string, any>) => {
    try {
      intl.formatMessage({ id }, values)
    } catch (error) {
      console.error(`Translation error for id "${id}":`, error)
      return id // Fallback to the id if translation fails
    }
    return intl.formatMessage({ id }, values)
  }

  return { t }
}
