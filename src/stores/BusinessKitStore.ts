import {
  createStore,
  fetchPostWithTriggers,
  fetchGetWithTriggers,
  EnhancedStore,
} from "./utils"

type BusinessKitPayload = Record<string, any>

interface BusinessKitStoreMethods {
  GetBK(): void
  Request(data: BusinessKitPayload): void
  Activate(data: BusinessKitPayload): void
}

type BusinessKitStoreType = EnhancedStore & BusinessKitStoreMethods

const BusinessKitStore = createStore(
  (store): { name: string } & BusinessKitStoreMethods => ({
    name: "BusinessKitStore",

    GetBK(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/business-kit",
        eventOk: "GET_BK_OK",
        eventKO: "GET_BK_KO",
      })
    },

    Request(data: BusinessKitPayload): void {
      fetchPostWithTriggers<BusinessKitPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/business-kit/request",
        payload: data,
        eventOk: "BK_REQUEST_OK",
        eventKO: "BK_REQUEST_KO",
      })
    },

    Activate(data: BusinessKitPayload): void {
      fetchPostWithTriggers<BusinessKitPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/business-kit/activate",
        payload: data,
        eventOk: "BK_ACTIVATE_OK",
        eventKO: "BK_ACTIVATE_KO",
      })
    },
  })
) as BusinessKitStoreType

export default BusinessKitStore
