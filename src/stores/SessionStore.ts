import {
  createStore,
  fetchPostWithTriggers,
  fetchGetWithTriggers,
  EnhancedStore,
} from "./utils"
import { AxiosRequestConfig } from "axios"

type UserData = Record<string, any>
type EmailData = Record<string, any>
type TokenType = string

interface SessionStoreMethods {
  MerchantLogin(userData: UserData): void
  ForgotPass(userData: UserData): void
  IsNewUser(userData: UserData): void
  Login(userData: UserData): void
  LoginBiometric(userData: UserData): void
  Create(userData: UserData, token: TokenType): void
  Verify(userData: UserData): void
  InvokeReset(userData: UserData): void
  Reset(userData: UserData): void
  SendContact(emailData: EmailData): void
  SendEmailCode(userData: UserData): void
  SendPhoneCode(userData: UserData, token: TokenType): void
  BusinessUpdateData(userData: UserData): void
  ValidatePhone(userData: UserData, token: TokenType): void
  CheckUniqueEmail(userData: UserData): void
  ValidateEmail(userData: UserData): void
  BusinessRegister(userData: UserData): void
  BusinessValidatePhone(userData: UserData, token: TokenType): void
  Update(userData: UserData): void
  Terms(): void
  TermsMediation(): void
  SignUpWith(userData: UserData): void
  LoginWith(userData: UserData): void
}

type SessionStoreType = EnhancedStore & SessionStoreMethods

const SessionStores = createStore(
  (store): { name: string } & SessionStoreMethods => ({
    name: "SessionStore",

    MerchantLogin(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/merchant_login",
        payload: userData,
        eventOk: "LOGIN_OK",
        eventKO: "LOGIN_ERROR",
      })
    },

    ForgotPass(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/send_reset_pass",
        payload: userData,
        eventOk: "RESET_PASS_OK",
        eventKO: "RESET_PASS_ERROR",
      })
    },

    IsNewUser(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/is_new_user",
        payload: userData,
        eventOk: "NEWUSER_OK",
        eventKO: "NEWUSER_KO",
      })
    },

    Login(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/login",
        payload: userData,
        eventOk: "LOGIN_OK",
        eventKO: "LOGIN_ERROR",
      })
    },

    LoginBiometric(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/login_biometric",
        payload: userData,
        eventOk: "LOGIN_BIO_OK",
        eventKO: "LOGIN_BIO_ERROR",
      })
    },

    Create(userData: UserData, token: TokenType): void {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/signup",
        payload: userData,
        eventOk: "USER_CREATE_OK",
        eventKO: "USER_CREATE_KO",
        axiosConfig: config,
      })
    },

    Verify(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/access/verify",
        payload: userData,
        eventOk: "VERIFY_OK",
        eventKO: "VERIFY_KO",
      })
    },

    InvokeReset(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/access/send_reset_pass",
        payload: userData,
        eventOk: "RESET_INVOCATION_OK",
        eventKO: "RESET_INVOCATION_KO",
      })
    },

    Reset(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/access/reset_pass",
        payload: userData,
        eventOk: "RESET_OK",
        eventKO: "RESET_KO",
      })
    },

    SendContact(emailData: EmailData): void {
      fetchPostWithTriggers<EmailData>({
        store: store as EnhancedStore,
        endpoint: "/api/access/send_contact_email",
        payload: emailData,
        eventOk: "SEND_CONTACT_OK",
        eventKO: "SEND_CONTACT_KO",
      })
    },

    SendEmailCode(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/send_email_code",
        payload: userData,
        eventOk: "SEND_EMAIL_CODE_OK",
        eventKO: "SEND_EMAIL_CODE_KO",
      })
    },

    SendPhoneCode(userData: UserData, token: TokenType): void {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/send_phone_code",
        payload: userData,
        eventOk: "SEND_PHONE_CODE_OK",
        eventKO: "SEND_PHONE_CODE_KO",
        axiosConfig: config,
      })
    },

    BusinessUpdateData(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/business-update-data",
        payload: userData,
        eventOk: "BUSINESS_UPDATE_DATA_OK",
        eventKO: "BUSINESS_UPDATE_DATA_KO",
      })
    },

    ValidatePhone(userData: UserData, token: TokenType): void {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/validate_phone",
        payload: userData,
        eventOk: "VALIDATE_PHONE_OK",
        eventKO: "VALIDATE_PHONE_KO",
        axiosConfig: config,
      })
    },

    CheckUniqueEmail(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/send_email_code",
        payload: userData,
        eventOk: "UNIQUE_EMAIL_OK",
        eventKO: "UNIQUE_EMAIL_KO",
      })
    },

    ValidateEmail(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/validate_email",
        payload: userData,
        eventOk: "VALIDATE_EMAIL_OK",
        eventKO: "VALIDATE_EMAIL_KO",
      })
    },

    BusinessRegister(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/business-register",
        payload: userData,
        eventOk: "BUSINESS_REGISTER_OK",
        eventKO: "BUSINESS_REGISTER_KO",
      })
    },

    BusinessValidatePhone(userData: UserData, token: TokenType): void {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/business-validate-phone",
        payload: userData,
        eventOk: "BUSINESS_VALIDATE_PHONE_OK",
        eventKO: "BUSINESS_VALIDATE_PHONE_KO",
        axiosConfig: config,
      })
    },

    Update(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/access/fillUser",
        payload: userData,
        eventOk: "FILL_USER_OK",
        eventKO: "FILL_USER_KO",
      })
    },

    Terms(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/access/terms",
        eventOk: "GET_TERMS_OK",
        eventKO: "GET_TERMS_KO",
      })
    },

    TermsMediation(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/access/terms-mediation",
        eventOk: "GET_TERMS_MEDIATION_OK",
        eventKO: "GET_TERMS_MEDIATION_KO",
      })
    },

    SignUpWith(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/signup_with",
        payload: userData,
        eventOk: "SIGNUP_WITH_OK",
        eventKO: "SIGNUP_WITH_KO",
      })
    },

    LoginWith(userData: UserData): void {
      fetchPostWithTriggers<UserData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/access/login_with",
        payload: userData,
        eventOk: "LOGIN_WITH_OK",
        eventKO: "LOGIN_WITH_KO",
      })
    },
  })
) as SessionStoreType

export default SessionStores
