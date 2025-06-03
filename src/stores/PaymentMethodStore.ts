import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

type UserIdType = string | number

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface PaymentMethodStoreMethods {
  List(querySet?: QuerySet): Promise<void>
  PublicList(userId: UserIdType): Promise<void>
}

type PaymentMethodStoreType = EnhancedStore & PaymentMethodStoreMethods

const PaymentMethodStore = createStore(
  (store): { name: string } & PaymentMethodStoreMethods => ({
    name: "PaymentMethodStore",

    List(
      querySet: QuerySet = { queryName: "paymentMethodList" }
    ): Promise<void> {
      return fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/payment_methods",
        eventOk: "PAYMENT_METHOD_LIST_OK",
        eventKO: "PAYMENT_METHOD_LIST_KO",
      })
    },

    PublicList(userId: UserIdType): Promise<void> {
      return fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/payment_methods/${userId}`,
        eventOk: "PAYMENT_METHOD_LIST_OK",
        eventKO: "PAYMENT_METHOD_LIST_KO",
      })
    },
  })
) as PaymentMethodStoreType

export default PaymentMethodStore
