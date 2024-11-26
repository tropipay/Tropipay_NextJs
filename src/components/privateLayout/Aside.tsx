import Link from "next/link"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { logout } from "@/actions/sessionActions"

const links = [
  { name: "Home", href: "/dashboard" },
  { name: "basic table", href: "/dashboard/basicTable" },
]

const Aside = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Toggle sidebar visibility function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <>
      {/* Sidebar for large screens */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 h-full pt-16 lg:flex flex-shrink-0 flex-col w-64 bg-white transition-all duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 bg-white divide-y space-y-1">
              <ul className="space-y-2 pb-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group focus:outline-none"
                    >
                      <span className="ml-3">{link.name}</span>
                    </Link>
                  </li>
                ))}
                <Button className="w-full" onClick={logout}>
                  Logout
                </Button>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6.293 6.293a1 1 0 011.414 0L12 9.586l4.293-4.293a1 1 0 111.414 1.414L13.414 11l4.293 4.293a1 1 0 01-1.414 1.414L12 12.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 11 6.293 6.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        )}
      </button>
    </>
  )
}

export default Aside
