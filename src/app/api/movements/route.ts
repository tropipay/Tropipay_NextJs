import { movements } from "@/app/queryDefinitions/movements/movements"
import { fetchHeaders } from "@/lib/utils"

export const POST = async (req: Request) => {
  // set returnMockData = false to return endpoint data ...
  const returnMockData = false

  if (returnMockData) {
    return Response.json({ success: true, status: 200, data: { movements } })
  }
  const body = JSON.stringify(await req.json())

  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/movements/business`,
    {
      method: "POST",
      headers: {
        ...fetchHeaders,
        Authorization: req.headers.get("authorization") ?? "",
      },
      body,
    }
  )

  return Response.json(await res.json())
}
