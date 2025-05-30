import { useEffect, useState } from "react"

type StoreAction = (obj: any) => void

interface StoreGroupConfig {
  stores: any[]
  eventPrefix: string
  actions: Record<string, StoreAction>
}

/**
 * Hook personalizado para manejar múltiples stores con la misma configuración
 * @param storeGroups Array de configuraciones para grupos de stores
 * @returns Objeto con errorData para manejo de errores
 */
const useStoreListener = (storeGroups: StoreGroupConfig[]) => {
  const [errorData, setErrorData] = useState<any>(null)

  useEffect(() => {
    const unsubscribers = storeGroups.flatMap(
      ({ stores, eventPrefix, actions }) => {
        return stores.map((store) => {
          const listener = (obj: any) => {
            // Ejecuta la acción si está definida
            if (actions[obj.type]) {
              actions[obj.type](obj)
            }
            // Manejo genérico para cualquier _KO no definido
            else if (obj.type.endsWith("_KO")) {
              if (!actions[obj.type]) {
                setErrorData(obj)
                console.error("Error no manejado:", obj)
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

  return { errorData }
}

export default useStoreListener
