type ApiDataResponse<T> = {
  items: T[]
  totalCount: number
}

interface SearchParams {
  page?: string
  size?: string
  sort?: string
  order?: string
  search?: string

  [key: string]: string | undefined // Parámetros de búsqueda dinámicos
}

interface GraphQLVariables {
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
