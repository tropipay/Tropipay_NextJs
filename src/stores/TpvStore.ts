import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type GenericPayload = Record<string, any>

interface TpvStoreMethods {
  ChargeToken(payload: GenericPayload): void
  ChargeTokenApplePay(payload: GenericPayload): void
  ChargeTokenGooglePay(payload: GenericPayload): void
  ValidateAppleSession(payload: GenericPayload): void
}

type TpvStoreType = EnhancedStore & TpvStoreMethods

const TpvStore = createStore((store): { name: string } & TpvStoreMethods => ({
  name: "TpvStore",

  ChargeToken(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/tpv/chargetoken`,
      payload,
      eventOk: "CHARGE_TOKEN_OK",
      eventKO: "CHARGE_TOKEN_KO",
    })
  },

  ChargeTokenApplePay(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/tpv/chargeTokenApplePay`,
      payload,
      eventOk: "CHARGE_TOKEN_OK",
      eventKO: "CHARGE_TOKEN_KO",
    })
  },

  ChargeTokenGooglePay(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/tpv/chargeTokenGooglePay`,
      payload,
      eventOk: "CHARGE_TOKEN_OK_GOOGLE",
      eventKO: "CHARGE_TOKEN_KO_GOOGLE",
    })
  },

  ValidateAppleSession(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/tpv/validateAppleSession`,
      payload,
      eventOk: "VALIDATE_SESSION_OK",
      eventKO: "VALIDATE_SESSION_KO",
    })
  },
})) as TpvStoreType

export default TpvStore
