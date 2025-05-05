"use client"

import { FormattedMessage } from "react-intl"

export default function Home() {
  return (
    <div className="w-full p-2 uppercase">
      <FormattedMessage id={"dashboard"} />
    </div>
  )
}
