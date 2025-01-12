"use client"
import React from "react"

type User = {
  id: string
  name: string
  slug: string
}

type UserTableProps = {
  data?: User[] // Se espera un array
}

const UserTable: React.FC<UserTableProps> = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Username</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.movements.map((user, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border border-gray-400 px-4 py-2">{user.id}</td>
              <td className="border border-gray-400 px-4 py-2">{user.name}</td>
              <td className="border border-gray-400 px-4 py-2">{user.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
