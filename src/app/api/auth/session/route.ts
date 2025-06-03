import { auth } from "@/auth"
import { Session } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const session = await auth()

    // Check if the user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "No authorized" }, { status: 401 })
    }

    // Filter sensitive user data
    const { id, token, logo, name, email } = session.user
    const safeSession: Session = {
      user: { id, token, logo, name, email },
      expires: session.expires,
    }

    return NextResponse.json(safeSession, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
