import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

interface OptionsStoreMethods {
  Get(): void
}

type OptionsStoreType = EnhancedStore & OptionsStoreMethods

const OptionsStore = createStore(
  (store): { name: string } & OptionsStoreMethods => ({
    name: "OptionsStore",

    Get(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/option",
        eventOk: "GET_OPTIONS_OK",
        eventKO: "GET_OPTIONS_KO",
      })
    },
  })
) as OptionsStoreType

export default OptionsStore
