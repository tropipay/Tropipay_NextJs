import {
  createStore,
  fetchPostWithTriggers,
  fetchDeleteWithTriggers,
  fetchPutWithTriggers,
  fetchGetWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type UpdatePayload = { client_id: string | number; [key: string]: any }
type SecurityCodeType = any

interface CredentialStoreMethods {
  Save(payload: GenericPayload, securityCode?: SecurityCodeType): void
  Authorize(payload: GenericPayload): void
  VerifyAuthorization(payload: GenericPayload): void
  Update(payload: UpdatePayload, securityCode?: SecurityCodeType): void
  Remove(id: string | number, securityCode?: SecurityCodeType): void
  RemoveBiometric(): void
  List(securityCode?: SecurityCodeType): void
  Select(id: string | number, securityCode?: SecurityCodeType): void
  Grant(): void
}

type CredentialStoreType = EnhancedStore & CredentialStoreMethods

const CredentialStore = createStore(
  (store): { name: string } & CredentialStoreMethods => ({
    name: "CredentialStore",

    Save(payload: GenericPayload, securityCode?: SecurityCodeType): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential",
        payload,
        eventOk: "CREDENTIAL_SAVE_OK",
        eventKO: "CREDENTIAL_SAVE_KO",
        securityCode: securityCode,
      })
    },

    Authorize(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/access/authorize",
        payload,
        eventOk: "CREDENTIAL_AUTHORIZE_OK",
        eventKO: "CREDENTIAL_AUTHORIZE_KO",
      })
    },

    VerifyAuthorization(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/access/authorize",
        payload,
        eventOk: "CREDENTIAL_VERIFY_AUTHORIZATION_OK",
        eventKO: "CREDENTIAL_VERIFY_AUTHORIZATION_KO",
      })
    },

    Update(payload: UpdatePayload, securityCode?: SecurityCodeType): void {
      fetchPutWithTriggers<UpdatePayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential/" + payload.client_id,
        payload,
        eventOk: "CREDENTIAL_UPDATE_OK",
        eventKO: "CREDENTIAL_UPDATE_KO",
        securityCode: securityCode,
      })
    },

    Remove(id: string | number, securityCode?: SecurityCodeType): void {
      fetchDeleteWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential/" + id,
        eventOk: "CREDENTIAL_REMOVE_OK",
        eventKO: "CREDENTIAL_REMOVE_KO",
        securityCode: securityCode,
      })
    },

    RemoveBiometric(): void {
      fetchPostWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential/delete-biometric",
        eventOk: "BIOMETRIC_CREDENTIAL_REMOVE_OK",
        eventKO: "BIOMETRIC_CREDENTIAL_REMOVE_KO",
      })
    },

    List(securityCode?: SecurityCodeType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential",
        eventOk: "CREDENTIAL_LIST_OK",
        eventKO: "CREDENTIAL_LIST_KO",
        securityCode: securityCode,
      })
    },

    Select(id: string | number, securityCode?: SecurityCodeType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential/" + id,
        eventOk: "CREDENTIAL_SELECT_OK",
        eventKO: "CREDENTIAL_SELECT_KO",
        securityCode: securityCode,
      })
    },

    Grant(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/credential/grant/list",
        eventOk: "CREDENTIAL_GRANT_OK",
        eventKO: "CREDENTIAL_GRANT_KO",
      })
    },
  })
) as CredentialStoreType

export default CredentialStore
