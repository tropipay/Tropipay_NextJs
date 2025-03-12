import {
  movementsState,
  movementsStateGroups,
} from "@/app/filterDefinitions/definitions"
import CopyToClipboard from "@/components/copyToClipboard"
import { Info } from "@/components/sectionComponents/info"
import { Section } from "@/components/sectionComponents/section"
import FacetedBadge from "@/components/table/facetedBadge"
import { Button } from "@/components/ui/button"
import { fetchHeaders, formatAmount } from "@/lib/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { FormattedMessage } from "react-intl"

export default function MovementDetail(props: any): JSX.Element {
  const row = props.row
  const { data: session } = useSession()
  const token = session?.user.token

  const onDownloadInvoiceFile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v3/movements/transferinvoice`,
        {
          method: "POST",
          headers: {
            ...fetchHeaders,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: row.id,
            label: row.state,
          }),
        }
      )
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = "invoice.pdf"
      link.click()
    } catch (e) {}
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
          {row.amount.value > 0 ? "+" : ""}
          {formatAmount(row.amount.value, row.amount.currency, "right")}
        </div>
        <FacetedBadge
          value={row.state}
          optionList={movementsState}
          optionListGroups={movementsStateGroups}
        />
      </div>
      <div className="flex justify-between items-center mb-4 pb-1">
        <p className="text-xs text-gray-500">Enviado a Franco Cantarini</p>
        <p className="text-xs text-gray-500">
          {row.completedAt &&
            format(new Date(row.completedAt), "dd/MM/yy HH:mm")}
        </p>
      </div>
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
          value={row.createdAt && format(new Date(row.createdAt), "dd/MM/yy")}
        />
        <Info
          label="Fecha valor"
          value={
            row.completedAt && format(new Date(row.completedAt), "dd/MM/yy")
          }
        />
      </Section>
      <div className="flex mt-4 gap-4">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={onDownloadInvoiceFile}
        >
          <FormattedMessage id="download" />
        </Button>
        <Button variant="default" className="w-1/2">
          <FormattedMessage id="refound" />
        </Button>
      </div>
    </div>
  )
}
