"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  user: UserSession
}

export const NavUserAccount = ({ user: { logo, name, email } }: Props) => {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={logo} alt={name} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  )
}
