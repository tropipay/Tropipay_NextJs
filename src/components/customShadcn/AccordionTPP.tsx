import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui"
import { AccordionContent } from "@radix-ui/react-accordion"

interface AccordionItemType {
  [key: string]: string
}

interface AccordionTPPProps {
  items: AccordionItemType[]
  contract: AccordionItemType[] | null
}

const AccordionTPP = ({
  items,
  contract = null,
  ...anotherProps
}: AccordionTPPProps) => {
  const Contract = { id: "id", title: "title", content: "content", ...contract }
  if (items)
    return (
      <Accordion type="single" collapsible {...anotherProps}>
        {items.map((item) => (
          <AccordionItem key={item[Contract.id]} value={item.id}>
            <AccordionTrigger>{item[Contract.title]}</AccordionTrigger>
            <AccordionContent className="mb-2">
              {item[Contract.content]}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
}

export default AccordionTPP
