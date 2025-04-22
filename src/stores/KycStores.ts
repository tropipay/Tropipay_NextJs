import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type CodeType = string | number
type SignatureType = string
type UserIdType = string | number
type MerchantIdType = string | number

interface VerifyPayload {
  code: CodeType
  signature: SignatureType
  userId: UserIdType
  merchantId: MerchantIdType
}

interface KycStoreMethods {
  Verify(
    code: CodeType,
    signature: SignatureType,
    userId: UserIdType,
    merchantId: MerchantIdType
  ): void
}

type KycStoreType = EnhancedStore & KycStoreMethods

const KycStores = createStore((store): { name: string } & KycStoreMethods => ({
  name: "KycStores",

  Verify(
    code: CodeType,
    signature: SignatureType,
    userId: UserIdType,
    merchantId: MerchantIdType
  ): void {
    const payload: VerifyPayload = { code, signature, userId, merchantId }
    fetchPostWithTriggers<VerifyPayload>({
      store: store as EnhancedStore,
      payload: payload,
      endpoint: "/api/v2/merchant/kyc/url",
      eventOk: "MERCHANT_KYC_URL_OK",
      eventKO: "MERCHANT_KYC_URL_KO",
    })
  },
})) as KycStoreType

export default KycStores
