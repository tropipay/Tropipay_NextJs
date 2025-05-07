import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  fetchPutWithTriggers,
  fetchDeleteWithTriggers,
  EnhancedStore,
} from "./utils"

type DepositAccountPayload = Record<string, any>
type SwiftPayload = Record<string, any>
type FilterType = Record<string, any> | undefined
type UserData = Record<string, any>
type DeletePayload = { id: string | number; [key: string]: any }

interface DepositAccountStoreMethods {
  Create(depositAccountData: DepositAccountPayload): void
  Validate(depositAccountData: DepositAccountPayload): void
  Validate_Swift(swiftData: SwiftPayload): void
  Edit(depositAccountData: DepositAccountPayload): void
  Delete(depositAccountData: DeletePayload): void
  List(filter: FilterType): void
  SendInvitation(userData: UserData): void
}

type DepositAccountStoreType = EnhancedStore & DepositAccountStoreMethods

const DepositAccountStore = createStore(
  (store): { name: string } & DepositAccountStoreMethods => ({
    name: "DepositAccountStore",

    Create(depositAccountData: DepositAccountPayload): void {
      fetchPostWithTriggers<DepositAccountPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/deposit_accounts",
        payload: depositAccountData,
        eventOk: "DEPOSIT_ACCOUNT_CREATE_OK",
        eventKO: "DEPOSIT_ACCOUNT_CREATE_KO",
      })
    },

    Validate(depositAccountData: DepositAccountPayload): void {
      fetchPostWithTriggers<DepositAccountPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/deposit_accounts/validate_account_number",
        payload: depositAccountData,
        eventOk: "DEPOSIT_ACCOUNT_VALIDATE_OK",
        eventKO: "DEPOSIT_ACCOUNT_VALIDATE_KO",
      })
    },

    Validate_Swift(swiftData: SwiftPayload): void {
      fetchPostWithTriggers<SwiftPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/deposit_accounts/validate_swift",
        payload: swiftData,
        eventOk: "DEPOSIT_ACCOUNT_VALIDATESWIFT_OK",
        eventKO: "DEPOSIT_ACCOUNT_VALIDATESWIFT_KO",
      })
    },

    Edit(depositAccountData: DepositAccountPayload): void {
      fetchPutWithTriggers<DepositAccountPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/deposit_accounts",
        payload: depositAccountData,
        eventOk: "DEPOSIT_ACCOUNT_EDIT_OK",
        eventKO: "DEPOSIT_ACCOUNT_EDIT_KO",
      })
    },

    Delete(depositAccountData: DeletePayload): void {
      fetchDeleteWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/deposit_accounts/${depositAccountData.id}`,
        eventOk: "DEPOSIT_ACCOUNT_DELETED_OK",
        eventKO: "DEPOSIT_ACCOUNT_DELETED_KO",
      })
    },

    List(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/deposit_accounts",
        eventOk: "DEPOSIT_ACCOUNT_LIST_OK",
        eventKO: "DEPOSIT_ACCOUNT_LIST_KO",
        filter,
      })
    },

    SendInvitation(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/deposit_accounts/sendInvitation",
        payload: userData,
        eventOk: "DEPOSIT_ACCOUNT_SEND_INVITATION_OK",
        eventKO: "DEPOSIT_ACCOUNT_SEND_INVITATION_KO",
      })
    },
  })
) as DepositAccountStoreType

export default DepositAccountStore
