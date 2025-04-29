export type ApiDataResponse<T> = {
  items: T[]
  totalCount: number
}

export type ApiRestDataResponse<T> = {
  count: number
  rows: T[]
  limit: number
  offset: string
}

export interface SearchParams {
  page?: string
  size?: string
  sort?: string
  order?: string
  search?: string

  [key: string]: string | undefined // Parámetros de búsqueda dinámicos
}

export interface GraphQLVariables {
  filter: {
    [key: string]: any // Filtros dinámicos
    generalSearch?: string
  }
  pagination: {
    limit: number
    offset: number
  }
  sort?: {
    field: string
    direction: string
  }
}
