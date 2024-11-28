import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"

/**
 * DropdownMenuTPP renders a dropdown menu component with customizable items and optional icons.
 *
 * @param {string} props.text - The text to display on the dropdown trigger button.
 * @param {React.Component} [props.icon=null] - Optional icon component to display alongside the text on the trigger button.
 * @param {Array} props.items - Array of items to display in the dropdown menu.
 * @param {Object} [props.checkbox=null] - Optional checkbox configuration with checked and onCheckedChange functions.
 * @param {...Object} anotherProps - Additional props to pass to the DropdownMenu component.
 * @returns {JSX.Element|null} A styled dropdown menu component with provided items, or null if no items are provided.
 * 
 * 
 * 
 * 

  props.items SAMPLE to SIMPLE dropdown menu -------------------------------------------------

  const itemsDropDown = [
    {
      text: "Email",
      icon: MailIcon,
      action: () => sendMail(),
    },
    {
      text: "whatsapp",
      icon: WhatsappIcon,
      action: () => sendWhatsapp(),
    }

  props.checkbox SAMPLE to CHECKED dropdown menu (hide/show table columns) -------------------

  const checkboxDropDown = {
    checked: (item) => {
      return item.getIsVisible()
    },
    onCheckedChange: (item, value) => {
      return item.toggleVisibility(!!value)
    },
  }
 
 */

interface MenuItemType {
  [key: string]: string
}

interface DropdownMenuTPPProps {
  text: string
  icon?: React.Component | null
  items: MenuItemType[]
  checkbox?: {
    checked: (item: any) => boolean
    onCheckedChange: (item: any, value: boolean) => void
  }
}

const DropdownMenuTPP = ({
  text,
  icon = null,
  items,
  checkbox = null,
  ...anotherProps
}: DropdownMenuTPPProps) => {
  const Icon = icon
  if (items)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild {...anotherProps}>
          <Button variant="outline">
            {text} {!!icon && <Icon className="ml-2 h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((mapedItem) => {
            const Icon = mapedItem.icon
            return (
              <div key={mapedItem.id + mapedItem.text}>
                {checkbox ? (
                  <DropdownMenuCheckboxItem
                    className="capitalize"
                    checked={checkbox.checked(mapedItem)}
                    onCheckedChange={(value) =>
                      checkbox.onCheckedChange(mapedItem, value)
                    }
                  >
                    {mapedItem.id ?? mapedItem.text}
                  </DropdownMenuCheckboxItem>
                ) : (
                  <DropdownMenuItem onClick={mapedItem.action}>
                    {!!Icon && <Icon />}
                    <span>{mapedItem.text}</span>
                    {!!mapedItem.shotcut && (
                      <DropdownMenuShortcut>
                        {mapedItem.shotcut}
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                )}
              </div>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
}

export default DropdownMenuTPP
