"use client"

import { Avatar } from "@/components/ui"
import { UserBusinessAccount } from "@/types/accounts"
import { cn } from "@/utils/data/utils"
import { AvatarImage } from "@radix-ui/react-avatar"

interface Props {
  userBusinessAccount: UserBusinessAccount
  asContext?: boolean
}

export const NavUserBusinessAccount = ({
  userBusinessAccount: { alias, currency },
  asContext = false,
}: Props) => {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={`/images/currencies/${currency}.svg`} alt={alias} />
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className={cn("truncate", !asContext && "font-semibold")}>
          {currency}
        </span>
        <span className={"truncate text-xs text-gray-500"}>{alias}</span>
      </div>
    </>
  )
}
