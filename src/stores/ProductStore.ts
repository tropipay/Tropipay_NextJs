import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface ProductStoreMethods {
  List(querySet?: QuerySet): void
}

type ProductStoreType = EnhancedStore & ProductStoreMethods

const ProductStore = createStore(
  (store): { name: string } & ProductStoreMethods => ({
    name: "ProductStore",

    List(querySet: QuerySet = { queryName: "productList" }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/products",
        eventOk: "PRODUCT_LIST_OK",
        eventKO: "PRODUCT_LIST_KO",
      })
    },
  })
) as ProductStoreType

export default ProductStore
