import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type SecurityCodeType = string | number
type TokenType = string | number
type ModeType = number | string
type SecretType = string
type PasswordType = string

interface GeneratePayload {
  securityCode: TokenType
}
interface VerifyPayload {
  securityCode: SecurityCodeType
}
interface SetOptPayload {
  code: SecurityCodeType
  type: ModeType
  mode: ModeType
  secret: SecretType
  securityCode: SecurityCodeType
}
interface GetOptFilter {
  mode: ModeType
}
interface SetPassPayload {
  oldPass: PasswordType
  newPass: PasswordType
  securityCode: SecurityCodeType
}

interface SecurityStoreMethods {
  Generate(token: TokenType): void
  Verify(securityCode: SecurityCodeType): void
  SetOpt(
    code: SecurityCodeType,
    type: ModeType,
    mode: ModeType,
    secret: SecretType,
    securityCode: SecurityCodeType
  ): void
  GetOpt(mode: ModeType): void
  SetPass(
    oldPass: PasswordType,
    newPass: PasswordType,
    securityCode: SecurityCodeType
  ): void
}

type SecurityStoreType = EnhancedStore & SecurityStoreMethods

const SecurityStore = createStore(
  (store): { name: string } & SecurityStoreMethods => ({
    name: "SecurityStore",

    Generate(token: TokenType): void {
      const payload: GeneratePayload = { securityCode: token }
      fetchPostWithTriggers<GeneratePayload>({
        store: store as EnhancedStore,
        payload: payload,
        endpoint: "/api/users/2fa/secret",
        eventOk: "SECURITY_2FA_GENERATE_OK",
        eventKO: "SECURITY_2FA_GENERATE_KO",
      })
    },

    Verify(securityCode: SecurityCodeType): void {
      const payload: VerifyPayload = { securityCode }
      fetchPostWithTriggers<VerifyPayload>({
        store: store as EnhancedStore,
        payload: payload,
        endpoint: "/api/users/2fa/verify",
        eventOk: "SECURITY_2FA_VERIFY_OK",
        eventKO: "SECURITY_2FA_VERIFY_KO",
      })
    },

    SetOpt(
      code: SecurityCodeType,
      type: ModeType,
      mode: ModeType,
      secret: SecretType,
      securityCode: SecurityCodeType
    ): void {
      const payload: SetOptPayload = { code, type, mode, secret, securityCode }
      fetchPostWithTriggers<SetOptPayload>({
        store: store as EnhancedStore,
        payload: payload,
        endpoint: "/api/users/2fa",
        eventOk: "SECURITY_2FA_OPT_OK",
        eventKO: "SECURITY_2FA_OPT_KO",
      })
    },

    GetOpt(mode: ModeType): void {
      const filter: GetOptFilter = { mode }
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        filter: filter,
        endpoint: "/api/users/2fa",
        eventOk: "SECURITY_2FA_GET_OK",
        eventKO: "SECURITY_2FA_GET_KO",
      })
    },

    SetPass(
      oldPass: PasswordType,
      newPass: PasswordType,
      securityCode: SecurityCodeType
    ): void {
      const payload: SetPassPayload = { oldPass, newPass, securityCode }
      fetchPostWithTriggers<SetPassPayload>({
        store: store as EnhancedStore,
        payload: payload,
        endpoint: "/api/users/pass",
        eventOk: "SECURITY_SET_PASS_OK",
        eventKO: "SECURITY_SET_PASS_KO",
      })
    },
  })
) as SecurityStoreType

export default SecurityStore
