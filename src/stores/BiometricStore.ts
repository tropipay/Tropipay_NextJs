import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type BiometricPayload = Record<string, any>

interface BiometricStoreMethods {
  BiometricRegisterStart(payload: BiometricPayload): void
  BiometricRegisterEnd(payload: BiometricPayload): void
  BiometricLoginStart(payload: BiometricPayload): void
}

type BiometricStoreType = EnhancedStore & BiometricStoreMethods

const BiometricStore = createStore(
  (store): { name: string } & BiometricStoreMethods => ({
    name: "BiometricStore",

    BiometricRegisterStart(payload: BiometricPayload): void {
      fetchPostWithTriggers<BiometricPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/register_biometric_start",
        payload,
        eventOk: "BIOMETRIC_REGISTER_START_OK",
        eventKO: "BIOMETRIC_REGISTER_START_KO",
      })
    },

    BiometricRegisterEnd(payload: BiometricPayload): void {
      fetchPostWithTriggers<BiometricPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/register_biometric_finish",
        payload,
        eventOk: "BIOMETRIC_REGISTER_FINISH_OK",
        eventKO: "BIOMETRIC_REGISTER_FINISH_KO",
      })
    },

    BiometricLoginStart(payload: BiometricPayload): void {
      fetchPostWithTriggers<BiometricPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/login_biometric_start",
        payload,
        eventOk: "BIOMETRIC_LOGIN_START_OK",
        eventKO: "BIOMETRIC_LOGIN_START_KO",
      })
    },
  })
) as BiometricStoreType

export default BiometricStore
