"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { balanceSummaryMock } from "@/app/queryDefinitions/reports/balanceSummary/balanceSummaryMock"
import DataComponent from "@/components/DataComponent"
import ReportBalanceSummary from "@/components/reports/ReportBalanceSummary"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

const PageClient = () => {
  const searchParams = useSearchParams()
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

  const queryConfig = {
    ...apiConfig.balanceSummary,
    url: `${apiConfig.balanceSummary.url}/${accountNumber}?startDate=${startDate}&endDate=${endDate}`,
  }

  /**
   * Handles the change of the date range for the report.
   * @param {string} value - The new date range value.
   * @returns {void}
   */
  const onChangeRangeDate = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("period", value)
      window.history.pushState(null, "", `?${newSearchParams.toString()}`)
    },
    [searchParams]
  )

  return (
    accountNumber && (
      <DataComponent
        key={queryConfig.key}
        showLoading
        {...{
          queryConfig,
          searchParams: { startDate, endDate },
          mockData: balanceSummaryMock,
        }}
      >
        <ReportBalanceSummary {...{ startDate, endDate, onChangeRangeDate }} />
      </DataComponent>
    )
  )
}

export default PageClient
