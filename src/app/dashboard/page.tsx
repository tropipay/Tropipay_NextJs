import { logout } from "@/actions/sessionActions"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const session = await auth()

  if (!session) {
    return <div>DASHBOARD</div>
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
