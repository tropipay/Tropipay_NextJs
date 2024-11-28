import { fetchGetWithTriggers } from "@/lib/utils"

export const DestinationCountryStore = {
  name: "DestinationCountryActions",
  List: () => {
    return fetchGetWithTriggers({
      endpoint: "http://localhost:3000/api2/countries",
    })
  },
  Destinations: () => {
    return fetchGetWithTriggers({
      endpoint: "/api/countries/destinations",
    })
  },
  Locations: (id = 0) => {
    return fetchGetWithTriggers({
      endpoint: "/api/countries/" + id + "/locations",
    })
  },
}
