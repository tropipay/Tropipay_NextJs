import { Card, CardContent } from "../ui/card"

type SectionProps = {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps): JSX.Element {
  return (
    <Card className="w-full mb-3">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-roboto font-semibold text-sm text-gray-400 mb-3">
            {title}
          </h3>
          <div className="space-y-1">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}
