import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface ReasonStoreMethods {
  List(querySet?: QuerySet): void
  Check(payload: GenericPayload): void
}

type ReasonStoreType = EnhancedStore & ReasonStoreMethods

const ReasonStore = createStore(
  (store): { name: string } & ReasonStoreMethods => ({
    name: "ReasonStore",

    List(querySet: QuerySet = { queryName: "reasonsList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/reasons",
        eventOk: "REASON_LIST_OK",
        eventKO: "REASON_LIST_KO",
      })
    },

    Check(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/reasons/check-concept",
        payload,
        eventOk: "CONCEPT_CHECK_OK",
        eventKO: "CONCEPT_CHECK_KO",
      })
    },
  })
) as ReasonStoreType

export default ReasonStore
