import { createStore, BaseStore } from "./utils"

interface PageChangePayload {
  result: {
    msg: string
    data: string // Assuming pageToGo is a string
  }
}

interface AppStoreMethods {
  Page(pageToGo: string): void
}

type AppStoreType = BaseStore & AppStoreMethods

const AppStores = createStore(
  (store): AppStoreMethods => ({
    Page(pageToGo: string): void {
      store.trigger<PageChangePayload>("PAGE_CHANGE", {
        result: {
          msg: "done",
          data: pageToGo,
        },
      })
    },
  })
)

export default AppStores as AppStoreType
