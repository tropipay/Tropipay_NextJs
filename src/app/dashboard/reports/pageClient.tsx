"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import ReportBalanceSummary from "@/components/reports/ReportBalanceSummary"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { callPostHog } from "@/utils/utils"
import { format, formatISO, parse } from "date-fns"
import { useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useMemo } from "react"

const PageClient = () => {
  const searchParams = useSearchParams()
  const postHog = usePostHog()
  const accountNumber = CookiesManager.getInstance().get("accountNumber")

  // Get dates from query params url
  const [startDate, endDate] = useMemo(() => {
    // Get current month interval for startDate and endDate.
    const currentDate = new Date()
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
    const end = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)

    return (
      searchParams.get("period")?.split(",") ?? [
        format(start, "dd/MM/yyyy"),
        format(end, "dd/MM/yyyy"),
      ]
    )
  }, [searchParams])

  const isoStartDate = startDate
    ? formatISO(parse(startDate, "dd/MM/yyyy", new Date()))
    : ""
  const isoEndDate = endDate
    ? formatISO(parse(endDate, "dd/MM/yyyy", new Date()))
    : ""
  const queryParams = [
    isoStartDate && `startDate=${isoStartDate}`,
    isoEndDate && `endDate=${isoEndDate}`,
  ]

  const queryConfig = {
    ...apiConfig.balanceSummary,
    url: `${apiConfig.balanceSummary.url}/${accountNumber}?${queryParams
      .filter((item) => !!item)
      .join("&")}`,
  }

  /**
   * Handles the change of the date range for the report.
   * @param {string} value - The new date range value.
   * @returns {void}
   */
  const onChangeRangeDate = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("period", value)
    callPostHog(postHog, "report:balance_summary:change_range_date", {
      filter_date: value,
    })
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  return (
    accountNumber && (
      <DataComponent
        key={queryConfig.key}
        showLoading
        {...{
          queryConfig,
          searchParams: {
            ...(isoStartDate && { startDate: isoStartDate }),
            ...(isoEndDate && { endDate: isoEndDate }),
          },
          // mockData: balanceSummaryMock,
        }}
      >
        <ReportBalanceSummary {...{ startDate, endDate, onChangeRangeDate }} />
      </DataComponent>
    )
  )
}

export default PageClient
