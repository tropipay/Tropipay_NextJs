import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type FilterType = Record<string, any> | undefined
type CardIdType = string | number
interface IdPayload {
  id: CardIdType
  [key: string]: any
}

interface TropiCardStoreMethods {
  CreateCard(payload: GenericPayload): void
  ListAccount(): void
  Freeze(id: CardIdType): void
  Unfreeze(payload: IdPayload): void
  ChangePin(payload: GenericPayload): void
  Recharge(payload: GenericPayload): void
  Withdraw(payload: GenericPayload): void
  Movements(id: CardIdType, filter: FilterType): void
  Delete(payload: IdPayload): void
  DownloadQR(payload: GenericPayload): void
  Pay(payload: GenericPayload): void
}

type TropiCardStoreType = EnhancedStore & TropiCardStoreMethods

const TropiCardStore = createStore(
  (store): { name: string } & TropiCardStoreMethods => ({
    name: "TropiCardStore",

    CreateCard(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/accounts`,
        payload,
        eventOk: "TROPICAD_CREATE_OK",
        eventKO: "TROPICAD_CREATE_KO",
      })
    },

    ListAccount(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/accounts`,
        eventOk: "TROPICAD_LIST_OK",
        eventKO: "TROPICAD_LIST_KO",
      })
    },

    Freeze(id: CardIdType): void {
      fetchPostWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/${id}/freeze`,
        eventOk: "TROPICAD_FREEZE_OK",
        eventKO: "TROPICAD_FREEZE_KO",
      })
    },

    Unfreeze(payload: IdPayload): void {
      fetchPostWithTriggers<IdPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/${payload.id}/unfreeze`,
        payload,
        eventOk: "TROPICAD_UNFREEZE_OK",
        eventKO: "TROPICAD_UNFREEZE_KO",
      })
    },

    ChangePin(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/pin`,
        payload,
        eventOk: "TROPICAD_CHANGEPIN_OK",
        eventKO: "TROPICAD_CHANGEPIN_KO",
      })
    },

    Recharge(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/tropicards/recharge",
        payload,
        eventOk: "TROPICAD_RECHARGE_OK",
        eventKO: "TROPICAD_RECHARGE_KO",
      })
    },

    Withdraw(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/tropicards/withdrawal",
        payload,
        eventOk: "TROPICAD_WITHDRAW_OK",
        eventKO: "TROPICAD_WITHDRAW_KO",
      })
    },

    Movements(id: CardIdType, filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v3/accounts/${id}/movements`,
        eventOk: "TROPICAD_MOVEMENTS_OK",
        eventKO: "TROPICAD_MOVEMENTS_KO",
        filter,
      })
    },

    Delete(payload: IdPayload): void {
      fetchPostWithTriggers<IdPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/${payload.id}/delete`,
        payload,
        eventOk: "TROPICAD_DELETE_OK",
        eventKO: "TROPICAD_DELETE_KO",
      })
    },

    DownloadQR(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/download`,
        payload,
        eventOk: "TROPICAD_DOWNLOAD_OK",
        eventKO: "TROPICAD_DOWNLOAD_KO",
      })
    },

    Pay(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/tropicards/pay`,
        payload,
        eventOk: "TROPICAD_PAY_OK",
        eventKO: "TROPICAD_PAY_KO",
      })
    },
  })
) as TropiCardStoreType

export default TropiCardStore
