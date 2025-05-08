import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type SlugType = string | number
type PaymentData = Record<string, any>

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface ServiceStoreMethods {
  List(querySet?: QuerySet): Promise<void>
  Get(slug: SlugType): void
  PayWithTppUrl(paymentData: PaymentData): void
}

type ServiceStoreType = EnhancedStore & ServiceStoreMethods

const ServiceStore = createStore(
  (store): { name: string } & ServiceStoreMethods => ({
    name: "ServiceStore",

    List(querySet: QuerySet = { queryName: "servicesList" }): Promise<void> {
      return fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/services",
        eventOk: "SERVICE_LIST_OK",
        eventKO: "SERVICE_LIST_KO",
      })
    },

    Get(slug: SlugType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/services/get/${slug}`,
        eventOk: "GET_SERVICE_OK",
        eventKO: "GET_SERVICE_KO",
      })
    },

    PayWithTppUrl(paymentData: PaymentData): void {
      fetchPostWithTriggers<PaymentData>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/movements/in/with_tpp_url",
        payload: paymentData,
        eventOk: "PAY_WITH_TPP_URL_OK",
        eventKO: "PAY_WITH_TPP_URL_KO",
      })
    },
  })
) as ServiceStoreType

export default ServiceStore
