import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/sectionComponents/section"
import { Info } from "@/components/sectionComponents/info"
import { format } from "date-fns"
import { formatAmount } from "@/lib/utils"
import CopyToClipboard from "@/components/copyToClipboard"
import FacetedBadge from "@/components/table/facetedBadge"
import {
  movementsState,
  movementsStateGroups,
} from "@/app/filterDefinitions/definitions"

export default function MovementDetail(props: any): JSX.Element {
  const row = props.row
  console.log("row:", row)
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
          {row.amount.value > 0 ? "+" : ""}
          {formatAmount(row.amount.value, row.amount.currency, "right")}
        </div>
        <FacetedBadge
          value={row.state}
          states={movementsState}
          stateGroups={movementsStateGroups}
        />
      </div>
      <div className="flex justify-between items-center mb-4 pb-1">
        <p className="text-xs text-gray-500">Enviado a Franco Cantarini</p>
        <p className="text-xs text-gray-500">
          {format(new Date(row.valueDate), "dd/MM/yy HH:mm")}
        </p>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <Section title="Datos de pago">
            <Info label="Monto autorizado" value="452,53 EUR" />
            <Info label="Método" value="Visa" />
            <Info label="Detalles" value="*2588" />
            <Info
              label="Código de referencia"
              value={row.reference}
              icon={
                <CopyToClipboard
                  text={row.reference}
                  message="El código fue copiado"
                />
              }
            />
            <Info label="Código de respuesta" value="10000" />
          </Section>

          <Section title="Datos del cliente">
            <Info label="Nombre" value="Juan" />
            <Info label="Apellido" value="Gil" />
            <Info label="Mail" value="JuanGil@gmail.com" />
            <Info label="Dirección" value="Carrer de l'equador-55, Barcelona" />
            <Info label="País" value="España" />
          </Section>

          <Section title="Métodos de pago">
            <Info label="Tipo" value="VISA" />
            <Info label="Pan de la tarjeta" value="1111" />
            <Info label="Fecha de vencimiento" value="30/11/2024" />
            <Info label="País de tarjeta" value="Estados Unidos" />
            <Info label="IP del pago" value="164.23.255.01" />
          </Section>

          <Section title="Cronograma">
            <Info
              label="Fecha de creación"
              value={format(new Date(row.creationDate), "dd/MM/yy")}
            />
            <Info
              label="Fecha valor"
              value={format(new Date(row.valueDate), "dd/MM/yy")}
            />
          </Section>
        </CardContent>
      </Card>
      <div className="flex mt-4 gap-4">
        <Button variant="outline" className="w-1/2">
          Descargar
        </Button>
        <Button variant="destructive" className="w-1/2">
          Reembolsar
        </Button>
      </div>
    </div>
  )
}
