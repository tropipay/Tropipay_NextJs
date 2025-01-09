import { useIntl } from "react-intl"

export const useTranslation = () => {
  const { formatMessage } = useIntl()

  const t = (id: string, values?: Record<string, string | number>) =>
    formatMessage({ id }, values)

  return { t }
}
