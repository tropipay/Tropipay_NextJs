import { FetchDataConfig } from "@/types/fetchData"
import { accountsApiConfig } from "./accounts/apiConfig"
import { chargesApiConfig } from "./charges/apiConfig"
import { movementsApiConfig } from "./movements/apiConfig"
import { reportsApiConfig } from "./reports/apiConfig"

export const apiConfig: Record<string, FetchDataConfig> = {
  ...accountsApiConfig,
  ...movementsApiConfig,
  ...chargesApiConfig,
  ...reportsApiConfig,
}
