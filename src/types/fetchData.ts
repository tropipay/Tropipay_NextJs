import { GraphQLVariables } from "./api"

export interface FetchOptions {
  queryConfig: FetchDataConfig
  variables: { variables: GraphQLVariables }
  columnVisibility: any
  token?: string
  debug?: boolean
}

export interface FetchDataConfig {
  url: string
  method: string
  config?: Record<string, any>
  columns?: Record<string, any>
  key?: string
  body?: {
    variables?: Record<string, any>
    [key: string]: any
  }
  staleTime?: number
  filters?: any
  columnsDef?: any
}
