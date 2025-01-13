export interface FetchDataConfig {
  url: string
  method: string
  headers: Record<string, string>
  body?: Record<string, any>
  config?: Record<string, any>
  columns?: Record<string, any>
  key?: string
}
