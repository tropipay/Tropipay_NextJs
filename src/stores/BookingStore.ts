import {
  createStore,
  fetchPostWithTriggers,
  fetchGetWithTriggers,
  fetchPutWithTriggers,
  EnhancedStore,
} from "./utils"
import { AxiosRequestConfig } from "axios"

type BookingData = Record<string, any>
type FilterType = Record<string, any> | undefined
type PaymentData = Record<string, any>
type GenericPayload = Record<string, any>
type DeactivatePayload = { id: string | number }
type ExpressPayload = { userId: string | number; [key: string]: any }

interface QuerySet {
  queryName: string
  queryTime: number
}

interface BookingStoreMethods {
  Charge(bookingData: BookingData): void
  ChargeUser(bookingData: BookingData): void
  Remittance(bookingData: BookingData): void
  LastMovements(filter: FilterType, querySet?: QuerySet): void
  Depositwithdrawal(querySet?: QuerySet): void
  Dailydeposit(querySet?: QuerySet): void
  List(filter: FilterType): void
  ListAdmin(filter: FilterType): void
  CountAll(filter: FilterType, querySet?: QuerySet): void
  Balance(): void
  Fee(): void
  GetRate(data: GenericPayload): void
  Paid(bookingData: BookingData): void
  PayOut(bookingData: BookingData): void
  ExternalPayout(bookingData: BookingData): void
  ExternalPayoutMediation(bookingData: BookingData): void
  CryptoExternalPayOut(bookingData: BookingData): void
  MediationPayOut(bookingData: BookingData): void
  Download(filter: FilterType): void
  Redsys(paymentData: PaymentData): void
  SendSecurityCode(paymentData: PaymentData): void
  PayTPV(paymentData: PaymentData): void
  GetCards(data: GenericPayload): void
  DownloadPDF(data: GenericPayload): void
  GenerateTopUp(data: GenericPayload): void
  Refund(data: GenericPayload): void
  ScheduledTransaction(bookingData: BookingData): void
  ScheduledList(filter: FilterType): void
  DeactivateScheduled(payload: DeactivatePayload): void
  ExpressPayment(payload: ExpressPayload): void
  BookingData(bookingId: string | number): void
}

type BookingStoreType = EnhancedStore & BookingStoreMethods

const BookingStore = createStore(
  (store): { name: string } & BookingStoreMethods => ({
    name: "BookingStore",

    Charge(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/charge",
        payload: bookingData,
        eventOk: "CHARGE_OK",
        eventKO: "CHARGE_KO",
      })
    },

    ChargeUser(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/chargeUser",
        payload: bookingData,
        eventOk: "CHARGE_USER_OK",
        eventKO: "CHARGE_USER_KO",
      })
    },

    Remittance(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/remittance",
        payload: bookingData,
        eventOk: "REMITTANCE_OK",
        eventKO: "REMITTANCE_KO",
      })
    },

    LastMovements(
      filter: FilterType,
      querySet: QuerySet = { queryName: "lastMovements", queryTime: 10000 }
    ): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements",
        eventOk: "BOOKING_LASTMOVEMENTS_OK",
        eventKO: "BOOKING_LASTMOVEMENTS_KO",
        filter: { ...filter, "q.service.ne": "EXPRESS_REMITTANCE" },
      })
    },

    Depositwithdrawal(
      querySet: QuerySet = { queryName: "depositwithdrawal", queryTime: 10000 }
    ): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/depositwithdrawal",
        eventOk: "BOOKING_DEPOSITWITHDRAWAL_OK",
        eventKO: "BOOKING_DEPOSITWITHDRAWAL_KO",
      })
    },

    Dailydeposit(
      querySet: QuerySet = { queryName: "dailydeposit", queryTime: 10000 }
    ): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/dailydeposit",
        eventOk: "BOOKING_DAILYDEPOSIT_OK",
        eventKO: "BOOKING_DAILYDEPOSIT_KO",
      })
    },

    List(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements",
        eventOk: "BOOKING_LIST_OK",
        eventKO: "BOOKING_LIST_KO",
        filter: { ...filter, "q.service.ne": "EXPRESS_REMITTANCE" },
      })
    },

    ListAdmin(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/booking/adminList",
        eventOk: "BOOKING_ADMIN_LIST_OK",
        eventKO: "BOOKING_ADMIN_LIST_KO",
        filter,
      })
    },

    CountAll(
      filter: FilterType,
      querySet: QuerySet = { queryName: "countAll", queryTime: 10000 }
    ): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/countall",
        eventOk: "BOOKING_COUNT_ALL_OK",
        eventKO: "BOOKING_COUNT_ALL_KO",
        filter,
      })
    },

    Balance(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/booking/balance",
        eventOk: "GETTING_BALANCE_OK",
        eventKO: "GETTING_BALANCE_KO",
      })
    },

    Fee(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/booking/fee",
        eventOk: "GETTING_FEE_OK",
        eventKO: "GETTING_FEE_KO",
      })
    },

    GetRate(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/get_rate",
        payload: data,
        eventOk: "GET_RATE_OK",
        eventKO: "GET_RATE_KO",
      })
    },

    Paid(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/paid",
        payload: bookingData,
        eventOk: "PAID_OK",
        eventKO: "PAID_KO",
      })
    },

    PayOut(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/payout",
        payload: bookingData,
        eventOk: "PAYOUT_OK",
        eventKO: "PAYOUT_KO",
      })
    },

    ExternalPayout(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/externalPayout",
        payload: bookingData,
        eventOk: "EXTERNAL_PAYOUT_OK",
        eventKO: "EXTERNAL_PAYOUT_KO",
      })
    },

    ExternalPayoutMediation(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/externalPayoutMediation",
        payload: bookingData,
        eventOk: "EXTERNAL_PAYOUTMEDIATION_OK",
        eventKO: "EXTERNAL_PAYOUTMEDIATION_KO",
      })
    },

    CryptoExternalPayOut(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/crypto/external_transfer",
        payload: bookingData,
        eventOk: "CRYPTO_PAYOUT_OK",
        eventKO: "CRYPTO_PAYOUT_KO",
      })
    },

    MediationPayOut(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/transaction/mediation-payout",
        payload: bookingData,
        eventOk: "PAYOUT_MEDIATION_OK",
        eventKO: "PAYOUT_MEDIATION_KO",
      })
    },

    Download(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/download",
        eventOk: "DOWNLOAD_OK",
        eventKO: "DOWNLOAD_KO",
        filter,
      })
    },

    Redsys(paymentData: PaymentData): void {
      fetchPostWithTriggers<PaymentData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/redsys",
        payload: paymentData,
        eventOk: "GETTING_REDSYS_OK",
        eventKO: "GETTING_REDSYS_KO",
      })
    },

    SendSecurityCode(paymentData: PaymentData): void {
      fetchPostWithTriggers<PaymentData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/sendSecurityCode",
        payload: paymentData,
        eventOk: "SEND_SECURITY_CODE_TRANSFER_OK",
        eventKO: "SEND_SECURITY_CODE_TRANSFER_KO",
      })
    },

    PayTPV(paymentData: PaymentData): void {
      fetchPostWithTriggers<PaymentData>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/paytpv",
        payload: paymentData,
        eventOk: "GETTING_PAYTPV_OK",
        eventKO: "GETTING_PAYTPV_KO",
      })
    },

    GetCards(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/extract_cards",
        payload: data,
        eventOk: "BOOKING_GET_CARD_OK",
        eventKO: "BOOKING_GET_CARD_KO",
      })
    },

    DownloadPDF(data: GenericPayload): void {
      const config: AxiosRequestConfig = {
        headers: { Accept: "application/pdf" },
        responseType: "blob",
      }
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/transferinvoice",
        payload: data,
        eventOk: "DOWNLOAD_PDF_OK",
        eventKO: "DOWNLOAD_PDF_KO",
        axiosConfig: config,
      })
    },

    GenerateTopUp(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/booking/generate_topup",
        payload: data,
        eventOk: "GENERATE_TOP_UP_DATA_OK",
        eventKO: "GENERATE_TOP_UP_DATA_KO",
      })
    },

    Refund(data: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/movements/in/refund",
        payload: data,
        eventOk: "REFUND_OK",
        eventKO: "REFUND_KO",
      })
    },

    ScheduledTransaction(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/v2/scheduled_transaction",
        payload: bookingData,
        eventOk: "SCHEDULED_TRANSACTION_OK",
        eventKO: "SCHEDULED_TRANSACTION_KO",
      })
    },

    ScheduledList(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v2/scheduled_transaction",
        eventOk: "SCHEDULED_TRANSACTION_LIST_OK",
        eventKO: "SCHEDULED_TRANSACTION_LIST_KO",
        filter,
      })
    },

    DeactivateScheduled(payload: DeactivatePayload): void {
      fetchPutWithTriggers<DeactivatePayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/scheduled_transaction/${payload.id}/deactivate`,
        eventOk: "DEACTIVATE_SCHEDULED_TRANSACTION_OK",
        eventKO: "DEACTIVATE_SCHEDULED_TRANSACTION_KO",
      })
    },

    ExpressPayment(payload: ExpressPayload): void {
      fetchPostWithTriggers<ExpressPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/business/${payload.userId}/pay-express`,
        payload,
        eventOk: "EXPRESS_PAYMENT_OK",
        eventKO: "EXPRESS_PAYMENT_KO",
      })
    },

    BookingData(bookingId: string | number): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: `/api/v2/booking/${bookingId}`,
        eventOk: "GET_BOOKING_DATA_OK",
        eventKO: "GET_BOOKING_DATA_KO",
      })
    },
  })
) as BookingStoreType

export default BookingStore
