import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type FilterType = Record<string, any> | undefined

interface GiftcardStoreMethods {
  Add(data: GenericPayload): void
  Analytics(filter: FilterType): void
  Delete(data: GenericPayload): void
  Consume(data: GenericPayload): void
  onConsumeInternal(data: GenericPayload): void
}

type GiftcardStoreType = EnhancedStore & GiftcardStoreMethods

const GiftcardStore = createStore(
  (store): { name: string } & GiftcardStoreMethods => ({
    name: "GiftcardStore",

    Add(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/giftcards/check/add",
        payload: data,
        eventOk: "GIFTCARD_ADD_OK",
        eventKO: "GIFTCARD_ADD_KO",
      })
    },

    Analytics(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/giftcards/analytics",
        filter: filter,
        eventOk: "GIFTCARD_ANALYTICS_OK",
        eventKO: "GIFTCARD_ANALYTICS_KO",
      })
    },

    Delete(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/giftcards/check/delete",
        payload: data,
        eventOk: "GIFTCARD_DELETE_OK",
        eventKO: "GIFTCARD_DELETE_KO",
      })
    },

    Consume(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/giftcards/consume",
        payload: data,
        eventOk: "GIFTCARD_CONSUME_OK",
        eventKO: "GIFTCARD_CONSUME_KO",
      })
    },

    onConsumeInternal(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/giftcards/consume-internal",
        payload: data,
        eventOk: "GIFTCARD_CONSUMEINTERNAL_OK",
        eventKO: "GIFTCARD_CONSUMEINTERNAL_KO",
      })
    },
  })
) as GiftcardStoreType

export default GiftcardStore
