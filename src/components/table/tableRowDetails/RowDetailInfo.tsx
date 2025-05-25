type InfoProps = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  icon?: React.ReactNode
}

export function RowDetailInfo({ label, value, icon }: InfoProps): any {
  if (!value) return null
  return (
    <div className="antialiased flex text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-24 md:w-32">{label}</span>
      <span className="flex-1 flex justify-end gap-2">
        <span>{value}</span> {icon}
      </span>
    </div>
  )
}
