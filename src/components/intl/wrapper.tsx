"use client"

import React, { useMemo, useState } from "react"
import { IntlProvider } from "react-intl"

import {
  LANG_DEFAULT,
  getLocaleI18nResource,
  getLocaleStored,
  setLocaleStored,
} from "./utils"

export const IntlContext = React.createContext({
  locale: LANG_DEFAULT,
  selectLanguage: (e: string) => {
    console.log(e)
  },
})

const IntlWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const local = getLocaleStored() ?? LANG_DEFAULT
  const lang = getLocaleI18nResource(local)
  const [locale, setLocale] = useState(local)
  const [messages, setMessages] = useState(lang)

  const selectLanguage = (e: string) => {
    setLocale(e)
    setLocaleStored(e)
    setMessages(getLocaleI18nResource(e))
  }

  return (
    <IntlContext.Provider
      value={useMemo(() => ({ locale, selectLanguage }), [])}
    >
      <IntlProvider messages={messages} locale={locale} defaultLocale={local}>
        <>{children}</>
      </IntlProvider>
    </IntlContext.Provider>
  )
}
export default IntlWrapper
