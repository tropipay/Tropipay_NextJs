import { FetchDataConfig } from "@/types/fetchData"

export const accountsApiConfig: Record<string, FetchDataConfig> = {
  accounts: {
    key: "",
    url: "/api/v3/accounts",
    method: "GET",
  },
}
