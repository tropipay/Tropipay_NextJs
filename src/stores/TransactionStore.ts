import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type SecurityHashType = string | number
type BankOrderCodeType = string | number

interface GetMediationStatePayload {
  securityHash: SecurityHashType
}
interface GetStatePayload {
  bankOrderCode: BankOrderCodeType
}
interface SetStatePayload {
  bankOrderCode: BankOrderCodeType
  [key: string]: any
}
interface SetCodePayload {
  bankOrderCode: BankOrderCodeType
  [key: string]: any
}

interface TransactionStoreMethods {
  GetMediationState(payload: GetMediationStatePayload): void
  GetState(payload: GetStatePayload): void
  SetState(payload: SetStatePayload): void
  SetCode(payload: SetCodePayload): void
}

type TransactionStoreType = EnhancedStore & TransactionStoreMethods

const TransactionStore = createStore(
  (store): { name: string } & TransactionStoreMethods => ({
    name: "TransactionStore",

    GetMediationState(payload: GetMediationStatePayload): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/transaction/mediation/${payload.securityHash}/state`,
        eventOk: "GETTING_MEDIATION_TRANSACTION_OK",
        eventKO: "GETTING_MEDIATION_TRANSACTION_KO",
      })
    },

    GetState(payload: GetStatePayload): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/transaction/${payload.bankOrderCode}/state`,
        eventOk: "GETTING_TRANSACTION_OK",
        eventKO: "GETTING_TRANSACTION_KO",
      })
    },

    SetState(payload: SetStatePayload): void {
      fetchPostWithTriggers<SetStatePayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/transaction/${payload.bankOrderCode}/state`,
        payload,
        eventOk: "SET_TRANSACTION_STATUS_OK",
        eventKO: "SET_TRANSACTION_STATUS_KO",
      })
    },

    SetCode(payload: SetCodePayload): void {
      fetchPostWithTriggers<SetCodePayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/transaction/${payload.bankOrderCode}/code`,
        payload,
        eventOk: "SET_TRANSACTION_CODE_OK",
        eventKO: "SET_TRANSACTION_CODE_KO",
      })
    },
  })
) as TransactionStoreType

export default TransactionStore
