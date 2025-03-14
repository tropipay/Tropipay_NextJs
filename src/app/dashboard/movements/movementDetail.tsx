import {
  movementsState,
  movementsStateGroups,
} from "@/app/filterDefinitions/definitions"
import { Info } from "@/components/sectionComponents/info"
import { Section } from "@/components/sectionComponents/section"
import FacetedBadge from "@/components/table/facetedBadge"
import { Button } from "@/components/ui/button"
import { fetchHeaders, formatAmount } from "@/lib/utils"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { FormattedMessage } from "react-intl"

export default function MovementDetail(props: any): JSX.Element {
  const row = props.data.data.movements.items[0]
  console.log("row:", row)
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
    <>
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-poppins text-2xl leading-5 tracking-tight uppercase font-bold">
            {row.movementDetail.amount.value > 0 ? "+" : ""}
            {formatAmount(
              row.movementDetail.amount.value,
              row.movementDetail.amount.currency,
              "right"
            )}
          </div>
          ********
          <FacetedBadge
            value={row.state}
            optionList={movementsState}
            optionListGroups={movementsStateGroups}
          />
        </div>
        <div className="flex justify-between items-center mb-4 pb-1">
          <p className="text-xs text-gray-500">******** {row.bankOrderCode}</p>
          <p className="text-xs text-gray-500">
            {row.movementDetail.completedAt &&
              format(
                new Date(row.movementDetail.completedAt),
                "dd/MM/yy HH:mm"
              )}
          </p>
        </div>
        <Section title="Datos del movimiento">
          <Info label="Tipo" value={row.movementDetail.type} />
          <Info label="Producto" value="******** FALTA PRODUCTO" />
          <Info label="Concepto" value={row.movementDetail.concept} />
        </Section>

        <Section title="Datos del beneficiario">
          <Info label="Alias" value={row.movementDetail.recipientData.alias} />
          <Info label="Nombre" value={row.movementDetail.recipientData.name} />
          <Info
            label="Cuenta"
            value={row.movementDetail.recipientData.account}
          />
          <Info label="Mail" value="******** FALTA MAIL" />
          <Info label="País destino" value="******** FALTA PAIS" />
        </Section>

        <Section title="Datos del remitente">
          <Info label="Nombre" value={row.movementDetail.senderData.name} />
          <Info label="Mail" value={row.movementDetail.senderData.email} />
          <Info label="Dirección" value={row.movementDetail.clientAddress} />
          <Info label="País" value="******** FALTA PAIS" />
        </Section>

        <Section title="Importes">
          <Info
            label="Importe"
            value={formatAmount(
              row.movementDetail.amount.value,
              row.movementDetail.amount.currency,
              "right"
            )}
          />
          <Info
            label="Tasa de cambio"
            value={
              row.movementDetail.conversionRate &&
              `******** 1 EUR = ${row.movementDetail.conversionRate} ${row.movementDetail.amount.currency}`
            }
          />
          <Info label="Comisión" value="******** FALTA COMISION" />
          <Info
            label="Neto"
            value={`******** ${formatAmount(
              row.movementDetail.chargedAmount.value,
              row.movementDetail.chargedAmount.currency,
              "right"
            )}`}
          />
        </Section>

        <Section title="Método de pago">
          {/* LISTOOOOOOOOOOOOOOOOO */}
          <Info label="Tipo" value={row.movementDetail.cardType} />
          <Info label="Cuenta" value="******** FALTA CUENTA" />
          <Info label="Pan de la tarjeta" value={row.movementDetail.cardPan} />
          <Info
            label="Fecha de vencimiento"
            value={
              row.movementDetail.cardExpirationDate &&
              format(
                new Date(row.movementDetail.cardExpirationDate),
                "dd/MM/yy"
              )
            }
          />
          <Info
            label="País de tarjeta"
            value={row.movementDetail.cardCountry}
          />
          <Info label="IP del pago" value={row.movementDetail.clientIp} />
        </Section>

        <Section title="Cronograma">
          {/* LISTOOOOOOOOOOOOOOOOO */}
          <Info
            label="Fecha de creación"
            value={
              row.movementDetail.createdAt &&
              format(new Date(row.movementDetail.createdAt), "dd/MM/yy")
            }
          />
          <Info
            label="Fecha valor"
            value={
              row.movementDetail.completedAt &&
              format(new Date(row.movementDetail.completedAt), "dd/MM/yy")
            }
          />
        </Section>

        <div className="flex mt-4 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onDownloadInvoiceFile}
          >
            <FormattedMessage id="download" />
          </Button>
          {/*           <Button variant="default" className="w-1/2">
            <FormattedMessage id="refound" />
          </Button>
 */}
        </div>
      </div>
    </>
  )
}
