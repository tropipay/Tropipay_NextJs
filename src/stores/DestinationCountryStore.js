import { fetchGetWithTriggers } from "@/lib/utils"

const DestinationCountryStore = {
  name: "DestinationCountryActions",
  List: () => {
    return fetchGetWithTriggers({
      endpoint: "/api2/countries",
    })
  },
  Destinations: () => {
    return fetchGetWithTriggers({
      endpoint: "/api/countries/destinations",
    })
  },
  Locations: (id = 0) => {
    return ProcessStore({
      endpoint: "/api/countries/" + id + "/locations",
    })
  },
}

export default DestinationCountryStore
