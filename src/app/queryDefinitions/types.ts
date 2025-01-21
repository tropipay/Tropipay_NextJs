export interface FetchDataConfig {
  url: string
  method: string
  headers: Record<string, string>
  config?: Record<string, any>
  columns?: Record<string, any>
  key?: string
  body?: {
    variables?: Record<string, any>
    [key: string]: any
  }
}
