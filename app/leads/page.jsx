"use client"

import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Leads from "@/components/pages/leads"
import { useApp } from "@/context/AppContext"

export default function LeadsPage() {
  const { leads, handleExportLeads } = useApp()
  const router = useRouter()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          <Leads
            leads={leads}
            onViewDetail={(lead) => {
              router.push(`/leads/${lead.id}`)
            }}
            onExport={handleExportLeads}
          />
        </main>
      </div>
    </div>
  )
}
