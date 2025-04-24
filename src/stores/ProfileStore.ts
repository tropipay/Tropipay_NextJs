import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"

type UserProfile = Record<string, any>

interface ProfileStoreMethods {
  FetchProfile(options?: { cacheTime?: number }): void
  getProfile(): UserProfile | undefined
}

type ProfileStoreType = EnhancedStore & ProfileStoreMethods

const PROFILE_CACHE_ID = "profile"

const ProfileStore = createStore(
  (store): { name: string } & ProfileStoreMethods => ({
    name: "ProfileStore",

    FetchProfile(options?: { cacheTime?: number }): void {
      fetchGetWithTriggers({
        store: store as EnhancedStore,
        endpoint: "/api/users/profile",
        cache: {
          id: PROFILE_CACHE_ID,
          time: options?.cacheTime === -1 ? -1 : options?.cacheTime ?? 300000,
        },
        eventOk: "USER_PROFILE_OK",
        eventKO: "USER_PROFILE_KO",
      })
    },

    getProfile(): UserProfile | undefined {
      // Use the injected getData method to read from Redux state
      const cachedEntry = store.getData<UserProfile>(PROFILE_CACHE_ID)
      return cachedEntry?.data // Return the data part of the cache entry, or undefined
    },
  })
) as ProfileStoreType

export default ProfileStore
