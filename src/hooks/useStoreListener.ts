import { useEffect } from "react"

type StoreAction = (obj: any) => void

interface StoreGroupConfig {
  stores: any[]
  eventPrefix: string
  actions: Record<string, StoreAction>
  setMessageData?: (obj: any) => void
}

/**
 * Hook personalizado para manejar múltiples stores con la misma configuración
 * @param storeGroups Array de configuraciones para grupos de stores
 */
const useStoreListener = (storeGroups: StoreGroupConfig[]) => {
  useEffect(() => {
    const unsubscribers = storeGroups.flatMap(
      ({ stores, eventPrefix, actions, setMessageData }) => {
        return stores.map((store) => {
          const listener = (obj: any) => {
            // Ejecuta la acción si está definida
            if (actions[obj.type]) {
              actions[obj.type](obj)
            }
            // Manejo genérico para cualquier _KO no definido
            else if (obj.type.endsWith("_KO")) {
              if (!actions[obj.type]) {
                if (setMessageData) {
                  setMessageData(obj)
                }
              }
            }
          }
          return store.listen(listener, eventPrefix)
        })
      }
    )

    // Cleanup function para desuscribirse
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  }, [storeGroups])
}

export default useStoreListener
