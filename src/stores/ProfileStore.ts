import { getToken } from "@/utils/user/utilsUser"
import {
  createStore,
  EnhancedStore,
  fetchGetWithTriggers,
  transformEndpointToV3,
} from "./utils"

type UserProfile = {
  lang: string
  type?: string
  data?: Record<string, any>
} & Record<string, any>

interface ProfileStoreMethods {
  FetchProfile(options?: { cacheTime?: number }): void
  getProfile(): UserProfile | undefined
  Update(user?: Record<string, any>): void
  exist(): boolean
  Clean(): void
  getProfileData(): Record<string, any> | { lang: string }
}

type ProfileStoreType = EnhancedStore & ProfileStoreMethods

const PROFILE_CACHE_ID = "profile"
const DEFAULT_LANGUAGE = "es"
const DEFAULT_CACHE_TIME = 300000

const ProfileStore = createStore(
  (store): { name: string } & ProfileStoreMethods => {
    // Flag para controlar petición en curso
    let isRequestInProgress = false

    return {
      name: "ProfileStore",

      FetchProfile(options?: { cacheTime?: number }): void {
        const profile = this.getProfile()

        if (profile?.type !== "USER_PROFILE_OK" && !isRequestInProgress) {
          isRequestInProgress = true

          fetchGetWithTriggers({
            store: store as EnhancedStore,
            endpoint: transformEndpointToV3("/api/users/profile"),
            cache: {
              id: PROFILE_CACHE_ID,
              time:
                options?.cacheTime === -1
                  ? -1
                  : options?.cacheTime ?? DEFAULT_CACHE_TIME,
            },
            eventOk: "USER_PROFILE_OK",
            eventKO: "USER_PROFILE_KO",
          })

          // Crear un listener temporal para este request específico
          const unsubscribe = store.listen((event) => {
            if (event.type === "USER_PROFILE_OK") {
              const profileData = event.data
              if (profileData) {
                store.setData(PROFILE_CACHE_ID, {
                  type: "USER_PROFILE_OK",
                  data: profileData,
                })
              }
              isRequestInProgress = false
              unsubscribe()
            } else if (event.type === "USER_PROFILE_KO") {
              isRequestInProgress = false
              unsubscribe()
            }
          }, "ProfileStore-FetchProfile")
        }
      },

      getProfile(): UserProfile | undefined {
        const cachedEntry = store.getData<UserProfile>(PROFILE_CACHE_ID)
        return cachedEntry?.data || { lang: DEFAULT_LANGUAGE }
      },

      Update(userOrResponse?: Record<string, any> | { data?: any }): void {
        if (userOrResponse) {
          const userData = userOrResponse.data?.data || userOrResponse
          store.setData(PROFILE_CACHE_ID, {
            type: "USER_PROFILE_OK",
            data: userData,
          })
        } else if (this.exist()) {
          this.FetchProfile()
        }
      },

      exist(): boolean {
        try {
          const token = getToken()
          return !!token
        } catch {
          return false
        }
      },

      Clean(): void {
        store.resetData(PROFILE_CACHE_ID)
      },

      getProfileData(): Record<string, any> | { lang: string } {
        try {
          const profile = this.getProfile()
          return profile?.data || { lang: DEFAULT_LANGUAGE }
        } catch {
          return { lang: DEFAULT_LANGUAGE }
        }
      },
    }
  }
) as ProfileStoreType

export default ProfileStore
