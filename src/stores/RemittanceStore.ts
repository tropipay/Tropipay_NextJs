import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type FilterType = Record<string, any> | undefined
type BookingData = Record<string, any>

interface RemittanceStoreMethods {
  GetLocations(filter: FilterType): void
  GetPrices(filter: FilterType): void
  GetOffices(filter: FilterType): void
  SendRemittance(bookingData: BookingData): void
  ChargeRemittance(bookingData: BookingData): void
}

type RemittanceStoreType = EnhancedStore & RemittanceStoreMethods

const RemittanceStore = createStore(
  (store): { name: string } & RemittanceStoreMethods => ({
    name: "RemittanceStore",

    GetLocations(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/remittance/locations",
        eventOk: "GET_LOCATIONS_OK",
        eventKO: "GET_LOCATIONS_KO",
        filter,
      })
    },

    GetPrices(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/remittance/prices",
        eventOk: "GET_PRICES_OK",
        eventKO: "GET_PRICES_KO",
        filter,
      })
    },

    GetOffices(filter: FilterType): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/remittance/offices",
        eventOk: "GET_OFFICES_OK",
        eventKO: "GET_OFFICES_KO",
        filter,
      })
    },

    SendRemittance(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/remittance/send-remittance",
        payload: bookingData,
        eventOk: "SEND_REMITTANCE_OK",
        eventKO: "SEND_REMITTANCE_KO",
      })
    },

    ChargeRemittance(bookingData: BookingData): void {
      fetchPostWithTriggers<BookingData>({
        store: store as EnhancedStore,
        endpoint: "/api/remittance/charge-remittance",
        payload: bookingData,
        eventOk: "CHARGE_REMITTANCE_OK",
        eventKO: "CHARGE_REMITTANCE_KO",
      })
    },
  })
) as RemittanceStoreType

export default RemittanceStore
