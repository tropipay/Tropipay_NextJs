import { urlParamsToFilter, urlParamsTyping } from "./utils"

interface FetchDataConfig {
  key: string
  url: string
  method: string
  headers?: Record<string, string>
  body?: {
    variables?: Record<string, any>
    [key: string]: any
  }
}

export interface FetchOptions {
  config: FetchDataConfig
  token: string | undefined
  urlParams: any
}

export async function makeApiRequest({
  config,
  token,
  urlParams,
}: FetchOptions) {
  const filter = urlParamsToFilter(urlParamsTyping(urlParams))

  const headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const body = {
    ...config.body,
    variables: {
      ...config.body?.variables,
      filter,
    },
  }

  const response = await fetch(config.url, {
    method: config.method,
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message ||
        `Error fetching data: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}
