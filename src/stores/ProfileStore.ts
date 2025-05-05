import { createStore, fetchGetWithTriggers, EnhancedStore } from "./utils"
import { getToken } from "@/utils/user/utilsUser"

type UserProfile = {
  lang: string
  type?: string
  result?: {
    data?: Record<string, any>
  }
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
            endpoint: "/api/users/profile",
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
            if (
              event.type === "USER_PROFILE_OK" ||
              event.type === "USER_PROFILE_KO"
            ) {
              isRequestInProgress = false
              unsubscribe() // Remover el listener después de recibir la respuesta
            }
          })
        }
      },

      getProfile(): UserProfile | undefined {
        const cachedEntry = store.getData<UserProfile>(PROFILE_CACHE_ID)
        return cachedEntry?.data || { lang: DEFAULT_LANGUAGE }
      },

      Update(user?: Record<string, any>): void {
        if (user) {
          store.setData(PROFILE_CACHE_ID, {
            type: "USER_PROFILE_OK",
            result: { data: user },
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
          return profile?.result?.data || { lang: DEFAULT_LANGUAGE }
        } catch {
          return { lang: DEFAULT_LANGUAGE }
        }
      },
    }
  }
) as ProfileStoreType

// Inicialización
ProfileStore.Update()

export default ProfileStore
