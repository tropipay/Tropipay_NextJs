import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface OccupationStoreMethods {
  List(querySet?: QuerySet): void
}

type OccupationStoreType = EnhancedStore & OccupationStoreMethods

const OccupationStore = createStore(
  (store): { name: string } & OccupationStoreMethods => ({
    name: "OccupationStore",

    List(querySet: QuerySet = { queryName: "occupationList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/occupations",
        eventOk: "OCCUPATION_LIST_OK",
        eventKO: "OCCUPATION_LIST_KO",
      })
    },
  })
) as OccupationStoreType

export default OccupationStore
