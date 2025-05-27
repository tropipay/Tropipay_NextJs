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
    const safeSession: Session = {
      user: {
        id: session.user.id,
        token: session.user.token,
        logo: session.user.logo,
        name: session.user.name,
        email: session.user.email,
      },
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
