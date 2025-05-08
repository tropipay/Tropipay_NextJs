import {
  createStore,
  fetchGetWithTriggers,
  EnhancedStore,
} from "@/stores/utils"

type AccountFilter = Record<string, any>

interface AccountsStoreMethods {
  List(filter: AccountFilter): void
  CountAll(id: string | number): void
  Movements(id: string | number, filter: AccountFilter): void
}

type AccountsStoreType = EnhancedStore & AccountsStoreMethods

const AccountsStore = createStore(
  (store): { name: string } & AccountsStoreMethods => ({
    name: "AccountsStore",

    List(filter: AccountFilter) {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/accounts`,
        eventOk: "ACCOUNTS_LIST_OK",
        eventKO: "ACCOUNTS_LIST_KO",
        filter: { ...filter },
      })
    },

    CountAll(id: string | number): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/accounts/${id}/movements/countall`,
        eventOk: "ACCOUNT_MOVEMENTS_COUNT_ALL_OK",
        eventKO: "ACCOUNT_MOVEMENTS_COUNT_ALL_KO",
      })
    },

    Movements(id: string | number, filter: AccountFilter): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/accounts/${id}/movements`,
        eventOk: "ACCOUNT_MOVEMENTS_OK",
        eventKO: "ACCOUNT_MOVEMENTS_KO",
        filter,
      })
    },
  })
) as AccountsStoreType

export default AccountsStore
