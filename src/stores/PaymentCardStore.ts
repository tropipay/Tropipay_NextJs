import {
  createStore,
  fetchPostWithTriggers,
  fetchGetWithTriggers,
  fetchPutWithTriggers,
  fetchDeleteWithTriggers,
  EnhancedStore,
} from "./utils"

type PaymentCardPayload = Record<string, any>
type FilterType = Record<string, any> | undefined
type PaymentCardId = string | number
type DeletePayload = { id: string | number; [key: string]: any }

interface PaymentCardStoreMethods {
  Create(paymentCardData: PaymentCardPayload): void
  Edit(paymentCardData: PaymentCardPayload): void
  Delete(paymentCardData: DeletePayload): void
  Notify(paymentCardData: PaymentCardPayload): void
  List(filter: FilterType): void
  Favorites(filter: FilterType): void
  Charges(id: PaymentCardId, filter: FilterType): void
}

type PaymentCardStoreType = EnhancedStore & PaymentCardStoreMethods

const PaymentCardStore = createStore(
  (store): { name: string } & PaymentCardStoreMethods => ({
    name: "PaymentCardStore",

    Create(paymentCardData: PaymentCardPayload): void {
      fetchPostWithTriggers<PaymentCardPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/paymentcards",
        payload: paymentCardData,
        eventOk: "PAYMENT_CARD_CREATED_OK",
        eventKO: "PAYMENT_CARD_CREATED_KO",
      })
    },

    Edit(paymentCardData: PaymentCardPayload): void {
      fetchPutWithTriggers<PaymentCardPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/paymentcards",
        payload: paymentCardData,
        eventOk: "PAYMENT_CARD_EDITED_OK",
        eventKO: "PAYMENT_CARD_EDITED_KO",
      })
    },

    Delete(paymentCardData: DeletePayload): void {
      fetchDeleteWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/paymentcards/${paymentCardData.id}`,
        eventOk: "PAYMENT_CARD_DELETED_OK",
        eventKO: "PAYMENT_CARD_DELETED_KO",
      })
    },

    Notify(paymentCardData: PaymentCardPayload): void {
      fetchPostWithTriggers<PaymentCardPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/paymentcards/notify",
        payload: paymentCardData,
        eventOk: "PAYMENT_CARD_NOTIFY_OK",
        eventKO: "PAYMENT_CARD_NOTIFY_KO",
      })
    },

    List(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/paymentcards",
        eventOk: "PAYMENT_CARD_LIST_OK",
        eventKO: "PAYMENT_CARD_LIST_KO",
        filter,
      })
    },

    Favorites(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/paymentcards/filters",
        eventOk: "PAYMENT_CARD_WITH_FILTER_OK",
        eventKO: "PAYMENT_CARD_WITH_FILTER_KO",
        filter,
      })
    },

    Charges(id: PaymentCardId, filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/paymentcards/${id}/details`,
        eventOk: "PAYMENT_CARD_CHARGES_LIST_OK",
        eventKO: "PAYMENT_CARD_CHARGES_LIST_KO",
        filter,
      })
    },
  })
) as PaymentCardStoreType

export default PaymentCardStore
