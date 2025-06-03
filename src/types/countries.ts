export interface Country {
  id: number
  name: string
  sepaZone: boolean
  state: number
  slug: string
  slugn: string
  callingCode: number
  isDestination: boolean
  isRisky: boolean
  currentCurrency: null | string
  slug3: string
  hasLocations: boolean
  rulesPhone: null | string
  trusted: number
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  position: null | number
}

export type Countries = Country[]
