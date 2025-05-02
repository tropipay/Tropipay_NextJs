"use client"

import React from "react"
import { IntlProvider } from "react-intl"

import { LANG_DEFAULT, getLocaleI18nResource, getLocaleStored } from "./utils"

export const IntlContext = React.createContext({
  locale: LANG_DEFAULT,
  selectLanguage: (e: string) => {
    console.log(e)
  },
})

const IntlWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const local = getLocaleStored()
  const messages = getLocaleI18nResource(local)

  return (
    <IntlProvider messages={messages} locale={local} defaultLocale={local}>
      <>{children}</>
    </IntlProvider>
  )
}
export default IntlWrapper
