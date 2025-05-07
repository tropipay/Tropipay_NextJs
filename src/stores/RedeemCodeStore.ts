import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type CodeType = string | number

interface RedeemCodeStoreMethods {
  Redeem(code: CodeType): void
}

type RedeemCodeStoreType = EnhancedStore & RedeemCodeStoreMethods

const RedeemCodeStore = createStore(
  (store): { name: string } & RedeemCodeStoreMethods => ({
    name: "RedeemCodeStore",

    Redeem(code: CodeType): void {
      fetchPostWithTriggers<CodeType>({
        store: store as EnhancedStore,
        endpoint: "/api/redeemCode",
        payload: code,
        eventOk: "REDEEM_CODE_OK",
        eventKO: "REDEEM_CODE_KO",
      })
    },
  })
) as RedeemCodeStoreType

export default RedeemCodeStore
