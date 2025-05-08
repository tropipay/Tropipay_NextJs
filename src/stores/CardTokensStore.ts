import {
  createStore,
  fetchGetWithTriggers,
  fetchPostWithTriggers,
  EnhancedStore,
} from "./utils"

type FilterType = Record<string, any> | undefined
type GenericPayload = Record<string, any>
type DeleteCardPayload = {
  cofToken: { id: string | number }
  [key: string]: any
}

interface CardTokensStoreMethods {
  GetCardTokens(): void
  SetPredefinedCard(payload: GenericPayload): void
  DeleteCardToken(payload: DeleteCardPayload): void
  AddCardToken(payload: GenericPayload): void
}

type CardTokensStoreType = EnhancedStore & CardTokensStoreMethods

const CardTokensStore = createStore(
  (store): { name: string } & CardTokensStoreMethods => ({
    name: "CardTokensStore",

    GetCardTokens(): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/v3/card_tokens",
        eventOk: "GET_CARD_TOKENS_OK",
        eventKO: "GET_CARD_TOKENS_KO",
        filter: { "q.service.ne": "EXPRESS_REMITTANCE" },
      })
    },

    SetPredefinedCard(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/card_tokens/predefined-card",
        payload,
        eventOk: "SET_PREDEFINED_CARD_OK",
        eventKO: "SET_PREDEFINED_CARD_KO",
      })
    },

    DeleteCardToken(payload: DeleteCardPayload): void {
      fetchPostWithTriggers<DeleteCardPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v3/card_tokens/deactivate-card/${payload.cofToken.id}`,
        payload,
        eventOk: "DELETE_CARD_TOKEN_OK",
        eventKO: "DELETE_CARD_TOKEN_KO",
      })
    },

    AddCardToken(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: "/api/v3/tokenized/card",
        payload,
        eventOk: "ADD_CARD_TOKEN_OK",
        eventKO: "ADD_CARD_TOKEN_KO",
      })
    },
  })
) as CardTokensStoreType

export default CardTokensStore
