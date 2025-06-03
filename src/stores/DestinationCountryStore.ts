import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface DestinationCountryStoreMethods {
  List(querySet?: QuerySet): void
  Destinations(querySet?: QuerySet): void
  Locations(id?: string | number, querySet?: QuerySet): void
}

type DestinationCountryStoreType = EnhancedStore &
  DestinationCountryStoreMethods

const DestinationCountryStore = createStore(
  (store): { name: string } & DestinationCountryStoreMethods => ({
    name: "DestinationCountryStore",

    List(querySet: QuerySet = { queryName: "destinationList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/countries",
        eventOk: "DESTINATION_COUNTRY_LIST_OK",
        eventKO: "DESTINATION_COUNTRY_LIST_KO",
      })
    },

    Destinations(querySet: QuerySet = { queryName: "destinations" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/countries/destinations",
        eventOk: "DESTINATIONS_COUNTRY_LIST_OK",
        eventKO: "DESTINATIONS_COUNTRY_LIST_KO",
      })
    },

    Locations(
      id: string | number = 0,
      querySet: QuerySet = { queryName: "locations" }
    ): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/countries/${id}/locations`,
        eventOk: "LOCATIONS_OK",
        eventKO: "LOCATIONS_KO",
      })
    },
  })
) as DestinationCountryStoreType

export default DestinationCountryStore
