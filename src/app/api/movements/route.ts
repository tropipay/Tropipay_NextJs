import { movements } from "@/app/queryDefinitions/movements/movements"
import { fetchHeaders } from "@/lib/utils"

export const POST = async (req: Request) => {
  // set returnMockData = false to return endpoint data ...
  const returnMockData = true

  if (returnMockData) {
    return Response.json({ success: true, status: 200, data: { movements } })
  }

  return await fetch(
    `${process.env.REACT_APP_API_URL}/api/v3/movements/business`,
    {
      method: "POST",
      headers: {
        ...fetchHeaders,
        Authorization: req.headers.get("authorization") ?? "",
      },
      body: await req.json(),
    }
  )
}
