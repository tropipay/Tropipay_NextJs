import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  fetchPutWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type FilterType = Record<string, any> | undefined
type ProductType = string | number
type StoreIdType = string | number

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface MarketProductStoreMethods {
  List(querySet?: QuerySet): void
  CheckAvailableProducts(payload: GenericPayload): void
  Buy(payload: GenericPayload, product: ProductType): void
  CheckNumber(payload: GenericPayload): void
  CheckNautaAccount(payload: GenericPayload): void
  CheckConsume(payload: GenericPayload): void
  ListBanners(querySet?: QuerySet): void
  StoreList(querySet?: QuerySet): void
  Categories(filter: FilterType): void
  GetStore(): void
  StoreCreate(payload: GenericPayload): void
  StoreUpdate(id: StoreIdType, payload: GenericPayload): void
}

type MarketProductStoreType = EnhancedStore & MarketProductStoreMethods

const MarketProductStore = createStore(
  (store): { name: string } & MarketProductStoreMethods => ({
    name: "MarketProductStore",

    List(querySet: QuerySet = { queryName: "marketProductList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/marketproducts",
        eventOk: "MARKET_PRODUCT_LIST_OK",
        eventKO: "MARKET_PRODUCT_LIST_KO",
      })
    },

    CheckAvailableProducts(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        payload,
        endpoint: "/api/marketproducts/checkAvailableProducts",
        eventOk: "MARKET_PRODUCT_CHECK_OK",
        eventKO: "MARKET_PRODUCT_CHECK_KO",
      })
    },

    Buy(payload: GenericPayload, product: ProductType): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/marketproducts/${product}/consume`,
        payload,
        eventOk: "BUY_PRODUCT_OK",
        eventKO: "BUY_PRODUCT_KO",
      })
    },

    CheckNumber(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/marketproducts/check-number",
        payload,
        eventOk: "CHECK_NUMBER_OK",
        eventKO: "CHECK_NUMBER_KO",
      })
    },

    CheckNautaAccount(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/marketproducts/check-nauta-account",
        payload,
        eventOk: "CHECK_NAUTA_ACCOUNT_OK",
        eventKO: "CHECK_NAUTA_ACCOUNT_KO",
      })
    },

    CheckConsume(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/marketproducts/checkConsume",
        payload,
        eventOk: "CHECK_CONSUME_OK",
        eventKO: "CHECK_CONSUME_KO",
      })
    },

    ListBanners(querySet: QuerySet = { queryName: "bannerList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/marketproducts/banners",
        eventOk: "MARKET_BANNER_LIST_OK",
        eventKO: "MARKET_BANNER_LIST_KO",
      })
    },

    StoreList(querySet: QuerySet = { queryName: "marketStoreList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/stores",
        eventOk: "MARKET_STORE_LIST_OK",
        eventKO: "MARKET_STORE_LIST_KO",
      })
    },

    Categories(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/stores/storeCategories",
        eventOk: "MARKET_CATEGORIES_LIST_OK",
        eventKO: "MARKET_CATEGORIES_LIST_KO",
        filter,
      })
    },

    GetStore(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/stores/byUser",
        eventOk: "MARKET_GET_STORE_OK",
        eventKO: "MARKET_GET_STORE_KO",
      })
    },

    StoreCreate(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        payload,
        endpoint: "/api/v2/stores",
        eventOk: "STORE_CREATE_OK",
        eventKO: "STORE_CREATE_KO",
      })
    },

    StoreUpdate(id: StoreIdType, payload: GenericPayload): void {
      fetchPutWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        payload,
        endpoint: `/api/v2/stores/${id}`,
        eventOk: "STORE_UPDATE_OK",
        eventKO: "STORE_UPDATE_KO",
      })
    },
  })
) as MarketProductStoreType

export default MarketProductStore
