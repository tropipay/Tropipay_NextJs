import { fetchGetWithTriggers } from "@/lib/utils"
import { getUser } from "@/lib/utilsUser"

export default async function Home() {
  const session = await getUser()
  const lista = await fetchGetWithTriggers({
    endpoint: "/api2/countries/destinations",
  })
  console.log("lista:", lista)
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      DASHBOARD
      <pre>{session}</pre>
    </div>
  )
}
