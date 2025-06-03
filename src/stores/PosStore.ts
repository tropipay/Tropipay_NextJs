import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  fetchDeleteWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type PosIdType = string | number

interface PosStoreMethods {
  List(): void
  Create(data: GenericPayload): void
  Remove(id: PosIdType): void
}

type PosStoreType = EnhancedStore & PosStoreMethods

const PosStore = createStore((store): { name: string } & PosStoreMethods => ({
  name: "PosStore",

  List(): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/v3/pos/list_pos_credentials",
      eventOk: "POS_LIST_OK",
      eventKO: "POS_LIST_KO",
    })
  },

  Create(data: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: "/api/v3/pos/create_pos_credential",
      payload: data,
      eventOk: "POS_CREATE_OK",
      eventKO: "POS_CREATE_KO",
    })
  },

  Remove(id: PosIdType): void {
    fetchDeleteWithTriggers({
      store: store as EnhancedStore,
      endpoint: `/api/v3/pos/${id}`,
      eventOk: "POS_REMOVE_OK",
      eventKO: "POS_REMOVE_KO",
    })
  },
})) as PosStoreType

export default PosStore
