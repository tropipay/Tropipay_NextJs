"use client"
import Aside from "@/components/privateLayout/Aside"
import Header from "@/components/privateLayout/Header"
import Footer from "@/components/privateLayout/Footer"
import React, { useState } from "react"
import TanstackProvider from "@/providers/TanstackProvider"

export default function DashboardLayout({ children }: ChildrenProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex overflow-hidden bg-white pt-16">
        <Aside /* isOpen={isSidebarOpen} */ /> {/* Asegúrate de pasar isOpen */}
        {isSidebarOpen && (
          <div
            className="bg-gray-900 opacity-50 fixed inset-0 z-10"
            id="sidebarBackdrop"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          id="main-content"
          className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
        >
          <main>
            <div className="pt-6 px-4">
              <div className="w-full min-h-[calc(100vh-230px)]">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  <TanstackProvider>{children}</TanstackProvider>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
