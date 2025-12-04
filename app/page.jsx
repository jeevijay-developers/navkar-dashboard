"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Login from "@/components/login"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Dashboard from "@/components/pages/dashboard"
import { useApp } from "@/context/AppContext"

export default function Home() {
  const { isAuthenticated, setIsAuthenticated, products, quotations } = useApp()
  const router = useRouter()

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          <Dashboard products={products} leads={quotations} />
        </main>
      </div>
    </div>
  )
}
