import {
  createStore,
  fetchPostWithTriggers,
  fetchGetWithTriggers,
  EnhancedStore,
} from "./utils"

type FilterType = string | number
type OrderCodeType = string | number
type PaymentCardData = Record<string, any>
type GenericPayload = Record<string, any>

interface LoadPaymentStoreMethods {
  Load(filter: FilterType): void
  Execute(filter: FilterType, paymentCardData: PaymentCardData): void
  LoadResult(orderCode: OrderCodeType): void
  PayCardToken(payload: GenericPayload): void
}

type LoadPaymentStoreType = EnhancedStore & LoadPaymentStoreMethods

const LoadPaymentStore = createStore(
  (store): { name: string } & LoadPaymentStoreMethods => ({
    name: "LoadPaymentStore",

    Load(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/loadPayments/${filter}`,
        eventOk: "PAYMENT_CARD_OK",
        eventKO: "PAYMENT_CARD_KO",
      })
    },

    Execute(filter: FilterType, paymentCardData: PaymentCardData): void {
      fetchPostWithTriggers<PaymentCardData>({
        store: store as EnhancedStore,
        endpoint: `/api/loadPayments/${filter}`,
        payload: paymentCardData,
        eventOk: "EXECUTE_PAYMENT_OK",
        eventKO: "EXECUTE_PAYMENT_KO",
      })
    },

    LoadResult(orderCode: OrderCodeType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/loadPayments/${orderCode}/detail`,
        eventOk: "GET_PAYMENT_RESULT_OK",
        eventKO: "GET_PAYMENT_RESULT_KO",
      })
    },

    PayCardToken(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/tokenized/payment`,
        payload,
        eventOk: "PAY_CARD_TOKEN_OK",
        eventKO: "PAY_CARD_TOKEN_KO",
      })
    },
  })
) as LoadPaymentStoreType

export default LoadPaymentStore
