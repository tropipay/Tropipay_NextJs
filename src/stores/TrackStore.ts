import { createStore, fetchPostWithTriggers, EnhancedStore } from "./utils"

type GenericPayload = Record<string, any>

interface TrackStoreMethods {
  Track(payload: GenericPayload): void
}

type TrackStoreType = EnhancedStore & TrackStoreMethods

const TrackStore = createStore(
  (store): { name: string } & TrackStoreMethods => ({
    name: "TrackStore",

    Track(payload: GenericPayload): void {
      fetchPostWithTriggers<GenericPayload>({
        store: store as EnhancedStore,
        endpoint: `/api/v2/track`,
        payload,
        eventOk: "TRACK_OK",
        eventKO: "TRACK_KO",
      })
    },
  })
) as TrackStoreType

export default TrackStore
