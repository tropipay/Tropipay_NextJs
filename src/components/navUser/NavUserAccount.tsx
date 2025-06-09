"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui"

interface Props {
  user: UserSession
}

export const NavUserAccount = ({ user: { logo, name, email } }: Props) => (
  <>
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={logo} alt={name} />
      <AvatarFallback className="rounded-lg">
        {name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{name}</span>
      <span className="truncate text-xs">{email}</span>
    </div>
  </>
)
