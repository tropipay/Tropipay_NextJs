import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

type FilterType = Record<string, any> | undefined

interface DocumentTypeStoreMethods {
  List(filter: FilterType): void
}

type DocumentTypeStoreType = EnhancedStore & DocumentTypeStoreMethods

const DocumentTypeStore = createStore(
  (store): { name: string } & DocumentTypeStoreMethods => ({
    name: "DocumentTypeStore",

    List(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/documentTypes",
        eventOk: "DOCUMENT_TYPE_LIST_OK",
        eventKO: "DOCUMENT_TYPE_LIST_KO",
        filter,
      })
    },
  })
) as DocumentTypeStoreType

export default DocumentTypeStore
