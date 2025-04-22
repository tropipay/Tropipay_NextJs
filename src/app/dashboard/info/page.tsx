"use client"
import SimplePage from "@/components/simplePage/simplePage"
import DestinationCountryStore from "@/stores/DestinationCountryStore"
import React, { useEffect } from "react"
import ProfileStore from "@/stores/ProfileStore"

const Page = () => {
  const listener = (obj) => {
    const actions = {
      DESTINATION_COUNTRY_LIST_OK: (obj) => {
        console.log("obj:", obj)
      },
    }
    actions[obj.type] && actions[obj.type](obj)
    // listenProcessError(obj, actions, setErrorData)
  }
  useEffect(() => {
    console.log('ProfileStore.getData("profile"):', ProfileStore.getProfile())
    const DestinationCountryStoreUnsusbriber =
      DestinationCountryStore.listen(listener)
    DestinationCountryStore.List()

    return () => {
      DestinationCountryStoreUnsusbriber()
    }
  }, [])

  return (
    <SimplePage title="Titulo" icon="info">
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">
          Esta es la página de información. Aquí puedes agregar información
          relevante sobre tu aplicación.
        </p>
      </div>
    </SimplePage>
  )
}

export default Page
