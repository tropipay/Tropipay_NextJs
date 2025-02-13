type InfoProps = {
  label: string
  value: string
  icon?: React.ReactNode
}

export function Info({ label, value, icon }: InfoProps): JSX.Element {
  return (
    <div className="antialiased flex text-sm text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-48">{label}</span>
      <span className="flex text-left gap-2">
        {value} {icon}
      </span>
    </div>
  )
}
