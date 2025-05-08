import {
  createStore,
  fetchPutWithTriggers,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type UserData = Record<string, any>
type GenericPayload = Record<string, any>
type UserIdType = string | number
type WidthType = number | string

interface GetPublicInfoPayload {
  userId: UserIdType
}
interface CreateBusinessPayload {
  userId: UserIdType
  [key: string]: any
}
interface GetUserUrlPayload {
  id: UserIdType
  width: WidthType
}

interface QuerySet {
  queryName: string
  queryTime?: number
}

interface UserStoreMethods {
  Edit(userData: UserData): void
  Balance(querySet?: QuerySet): void
  SendSecurityCode(userData: UserData): void
  ValidateToken(userData: UserData): void
  GetDocuments(userData: UserData): void
  UploadDocument(userData: UserData): void
  Affiliates(querySet?: QuerySet): void
  SendAffiliateLink(payload: GenericPayload): void
  GetPublicInfo(payload: GetPublicInfoPayload, querySet?: QuerySet): void
  CreateBusinessPaylink(payload: CreateBusinessPayload): void
  CreateBusinessExpressPay(payload: CreateBusinessPayload): void
  GetAnalyticsUrl(): void
  GetAnalyticsMarketUrl(): void
  GetUserUrl(payload: GetUserUrlPayload, querySet?: QuerySet): void
  DownloadQR(): void
}

type UserStoreType = EnhancedStore & UserStoreMethods

const UserStore = createStore((store): { name: string } & UserStoreMethods => ({
  name: "UserStore",

  Edit(userData: UserData): void {
    fetchPutWithTriggers<UserData>({
      store: store as EnhancedStore,
      endpoint: "/api/users",
      payload: userData,
      eventOk: "USER_EDIT_OK",
      eventKO: "USER_EDIT_KO",
    })
  },

  Balance(
    querySet: QuerySet = { queryName: "usersBalance", queryTime: 60000 }
  ): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/users/balance",
      eventOk: "GETTING_BALANCE_OK",
      eventKO: "GETTING_BALANCE_KO",
    })
  },

  SendSecurityCode(userData: UserData): void {
    fetchPostWithTriggers<UserData>({
      store: store as EnhancedStore,
      endpoint: "/api/users/sendSecurityCode",
      payload: userData,
      eventOk: "USER_SEND_SECURITY_CODE_OK",
      eventKO: "USER_SEND_SECURITY_CODE_KO",
    })
  },

  ValidateToken(userData: UserData): void {
    fetchPostWithTriggers<UserData>({
      store: store as EnhancedStore,
      endpoint: "/api/users/validateToken",
      payload: userData,
      eventOk: "USER_VALIDATE_TOKEN_OK",
      eventKO: "USER_VALIDATE_TOKEN_KO",
    })
  },

  GetDocuments(userData: UserData): void {
    fetchPostWithTriggers<UserData>({
      store: store as EnhancedStore,
      endpoint: "/api/users/getDocuments",
      payload: userData,
      eventOk: "GET_DOCUMENTS_OK",
      eventKO: "GET_DOCUMENTS_KO",
    })
  },

  UploadDocument(userData: UserData): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: "/api/users/uploadDocument",
      payload: userData,
      eventOk: "UPLOAD_DOCUMENT_OK",
      eventKO: "UPLOAD_DOCUMENT_KO",
    })
  },

  Affiliates(querySet: QuerySet = { queryName: "affiliates" }): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/v3/users/affiliates",
      eventOk: "AFFILIATES_DATA_OK",
      eventKO: "AFFILIATES_DATA_KO",
    })
  },

  SendAffiliateLink(payload: GenericPayload): void {
    fetchPostWithTriggers<GenericPayload>({
      store: store as EnhancedStore,
      endpoint: "/api/v3/users/share-affiliate-link",
      payload,
      eventOk: "SEND_AFFILIATE_LINK_OK",
      eventKO: "SEND_AFFILIATE_LINK_KO",
    })
  },

  GetPublicInfo(
    payload: GetPublicInfoPayload,
    querySet: QuerySet = { queryName: "businessPublicInfo" }
  ): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: `/api/v3/business/${payload.userId}/public-info`,
      eventOk: "GET_PUBLIC_INFO_OK",
      eventKO: "GET_PUBLIC_INFO_KO",
    })
  },

  CreateBusinessPaylink(payload: CreateBusinessPayload): void {
    fetchPostWithTriggers<CreateBusinessPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/business/${payload.userId}/create-paylink`,
      payload,
      eventOk: "CREATED_PAYLINK_OK",
      eventKO: "CREATED_PAYLINK_KO",
    })
  },

  CreateBusinessExpressPay(payload: CreateBusinessPayload): void {
    fetchPostWithTriggers<CreateBusinessPayload>({
      store: store as EnhancedStore,
      endpoint: `/api/v3/business/${payload.userId}/create-expresspay`,
      payload,
      eventOk: "CREATED_EXPRESSPAY_OK",
      eventKO: "CREATED_EXPRESSPAY_KO",
    })
  },

  GetAnalyticsUrl(): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/users/getUrlAnalytics",
      eventOk: "GET_METABASE_URL_OK",
      eventKO: "GET_METABASE_URL_KO",
    })
  },

  GetAnalyticsMarketUrl(): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/users/getUrlAnalyticsMarket",
      eventOk: "GET_METABASEMARKET_URL_OK",
      eventKO: "GET_METABASEMARKET_URL_KO",
    })
  },

  GetUserUrl(
    payload: GetUserUrlPayload,
    querySet: QuerySet = { queryName: "businessUrl" }
  ): void {
    const { id, width } = payload
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: `/api/v3/business/${id}/url?width=${width}`,
      eventOk: "GET_USER_URL_OK",
      eventKO: "GET_USER_URL_KO",
    })
  },

  DownloadQR(): void {
    fetchGetWithTriggers({
      store: store as EnhancedStore,
      endpoint: "/api/v3/users/download-qr",
      eventOk: "DOWNLOAD_QR_OK",
      eventKO: "DOWNLOAD_QR_KO",
    })
  },
})) as UserStoreType

export default UserStore
