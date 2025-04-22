import { FetchDataConfig } from "@/types/fetchData"

export const reportsApiConfig: Record<string, FetchDataConfig> = {
  balanceSummary: {
    key: "balanceSummary",
    url: "/api/v3/reports/balance-summary",
    method: "GET",
  },
}
