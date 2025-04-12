interface Props {
  className?: string
}

export default function ReportFooter({ className }: Props) {
  return (
    <header className={`w-full text-left font-sans ${className || ""}`}>
      <div className="mb-1">
        <h1 className="font-bold mb-1">NUCLEO TECHNOLOGY INVESTMENTS SL</h1>
        <p className="text-sm font-medium">B16344806</p>
      </div>

      <div className="mb-1 text-sm">
        Calle Bailen 71 Bis 5to 3era CP 08009 Barcelona, Barcelona, España
      </div>

      <p className="text-xs text-gray-600 max-w-2xl leading-tight">
        NUCLEO TECHNOLOGY INVESTMENTS, SL. agente autorizado de TITANES
        TELECOMUNICACIONES S.A Entidad de pago inscrita en el Registro de
        Entidades de Pago del Banco de España con código 6845
      </p>
    </header>
  )
}
