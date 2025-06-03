import { createStore, BaseStore } from "./utils"

interface PageChangePayload {
  result: {
    msg: string
    data: string // Assuming pageToGo is a string
  }
}

interface AppStoreMethods {
  name: string
  Page(pageToGo: string): void
}

type AppStoreType = BaseStore & AppStoreMethods

const AppStores = createStore(
  (store): AppStoreMethods => ({
    name: "AppStore",
    Page(pageToGo: string): void {
      store.trigger("PAGE_CHANGE", {
        // @ts-ignore
        result: {
          msg: "done",
          data: pageToGo,
        },
      })
    },
  })
)

export default AppStores as AppStoreType
