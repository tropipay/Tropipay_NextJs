// app/dashboard/ejemplo/page.tsx
import { QueryClient, dehydrate } from "@tanstack/react-query"
import DataComponent from "@/components/DataComponent"

const fetchData = async () => {
  const res = await fetch("http://localhost:3000/api2/countries/destinations")
  if (!res.ok) throw new Error("Error al obtener los datos")
  return res.json()
}

export default async function Page() {
  // Crear QueryClient para SSR
  const queryClient = new QueryClient()

  // Prefetch de datos en el servidor
  await queryClient.prefetchQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  })

  // Deshidrata el estado de React Query para pasarlo al cliente
  const dehydratedState = dehydrate(queryClient)

  return (
    <DataComponent
      dehydratedState={dehydratedState}
      fetchURL="http://localhost:3000/api2/countries/destinations"
    />
  )
}
