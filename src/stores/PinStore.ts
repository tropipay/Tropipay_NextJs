import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type GenericPayload = Record<string, any>

interface PinStoreMethods {
  Create(payload: GenericPayload): void
  Delete(): void
  DailyLimit(payload: GenericPayload): void
}

type PinStoreType = EnhancedStore & PinStoreMethods

const PinStore = createStore((store): { name: string } & PinStoreMethods => ({
  name: "PinStore",

  Create(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: "/api/v2/userPin/create",
      payload,
      eventOk: "PIN_CREATE_OK",
      eventKO: "PIN_CREATE_KO",
    })
  },

  Delete(): void {
    fetchPostWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/v2/userPin/delete",
      eventOk: "PIN_DELETE_OK",
      eventKO: "PIN_DELETE_KO",
    })
  },

  DailyLimit(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: "/api/v2/userPin/dailyLimit",
      payload,
      eventOk: "PIN_DAILYLIMIT_OK",
      eventKO: "PIN_DAILYLIMIT_KO",
    })
  },
})) as PinStoreType

export default PinStore
