"use client"

import { createIntl, createIntlCache } from "react-intl"
import { LANG_DEFAULT, getLocaleI18nResource, getLocaleStored } from "./utils"

const local = getLocaleStored() ?? LANG_DEFAULT
const lang = getLocaleI18nResource(local)
const cache = createIntlCache()

const intlGlobal = createIntl(
  {
    locale: local,
    messages: lang,
  },
  cache
)

export default intlGlobal
