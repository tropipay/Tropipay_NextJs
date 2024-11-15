"use client"
import TableTPP from "@/components/customShadcn/TableTPP"
import React from "react"
const items = [
  {
    id: 1,
    title: "Accordion 1",
    content: "Content 1",
  },
  {
    id: 2,
    title: "Accordion 2",
    content: "Content 2",
  },
  {
    id: 3,
    title: "Accordion 3",
    content: "Content 3",
  },
]
const page = () => {
  return <TableTPP items={items} />
}

export default page
