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
  filters?: any
}
