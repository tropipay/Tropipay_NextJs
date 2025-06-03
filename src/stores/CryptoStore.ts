import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type GenericPayload = Record<string, any>

interface CryptoStoreMethods {
  GenerateTopUp(data: GenericPayload): void
  GenerateTopUpPayment(data: GenericPayload): void
  GetRate(data: GenericPayload): void
}

type CryptoStoreType = EnhancedStore & CryptoStoreMethods

const CryptoStore = createStore(
  (store): { name: string } & CryptoStoreMethods => ({
    name: "CryptoStore",

    GenerateTopUp(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/crypto/generate-topup",
        payload: data,
        eventOk: "CRYPTO_GENERATE_TOPUP_OK",
        eventKO: "CRYPTO_GENERATE_TOPUP_KO",
      })
    },

    GenerateTopUpPayment(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/crypto/generate_topup_payment",
        payload: data,
        eventOk: "CRYPTO_GENERATE_TOPUP_PAYMENT_OK",
        eventKO: "CRYPTO_GENERATE_TOPUP_PAYMENT_KO",
      })
    },

    GetRate(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/crypto/rate",
        payload: data,
        eventOk: "CRYPTO_GET_RATE_OK",
        eventKO: "CRYPTO_GET_RATE_KO",
      })
    },
  })
) as CryptoStoreType

export default CryptoStore
