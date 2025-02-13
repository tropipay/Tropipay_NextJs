type SectionProps = {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps): JSX.Element {
  return (
    <div>
      <h3 className="font-roboto font-semibold text-sm text-gray-400 mb-3">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
