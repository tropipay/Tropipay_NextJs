import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type GenericPayload = Record<string, any>
type OrderCodeType = string | number

interface VoucherStoreMethods {
  Charge(data: GenericPayload): void
  LoadResult(orderCode: OrderCodeType): void
  SendGift(data: GenericPayload): void
}

type VoucherStoreType = EnhancedStore & VoucherStoreMethods

const VoucherStore = createStore(
  (store): { name: string } & VoucherStoreMethods => ({
    name: "VoucherStore",

    Charge(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/voucher",
        payload: data,
        eventOk: "CHARGE_VOUCHER_OK",
        eventKO: "CHARGE_VOUCHER_KO",
      })
    },

    LoadResult(orderCode: OrderCodeType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/voucher/${orderCode}/detail`,
        eventOk: "GET_VOUCHER_DETAIL_OK",
        eventKO: "GET_VOUCHER_DETAIL_KO",
      })
    },

    SendGift(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/voucher/sendGift",
        payload: data,
        eventOk: "SEND_GIFT_OK",
        eventKO: "SEND_GIFT_KO",
      })
    },
  })
) as VoucherStoreType

export default VoucherStore
