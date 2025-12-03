"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Leads from "@/components/pages/leads"
import { useApp } from "@/context/AppContext"

export default function LeadsPage() {
  const { quotations, loading, fetchQuotations } = useApp()
  const router = useRouter()

  useEffect(() => {
    fetchQuotations()
  }, [])

  const handleExportQuotations = () => {
    const csv = [
      ["Quotation #", "Customer Name", "Email", "Phone", "Company", "Items Count", "Subtotal", "Tax", "Discount", "Total", "Status", "Created Date"],
      ...quotations.map((q) => [
        q.quotationNumber,
        q.userDetails?.name || "",
        q.userDetails?.email || "",
        q.userDetails?.phone || "",
        q.userDetails?.companyName || "",
        q.items?.length || 0,
        q.pricing?.subtotal || 0,
        q.pricing?.taxAmount || 0,
        q.pricing?.discount || 0,
        q.pricing?.total || 0,
        q.status,
        new Date(q.createdAt).toLocaleString(),
      ]),
    ]
    const csvContent = csv.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quotations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          <Leads
            quotations={quotations}
            loading={loading}
            onViewDetail={(quotation) => {
              // You can create a detail page later
              window.open(quotation.pdfUrl, '_blank')
            }}
            onExport={handleExportQuotations}
          />
        </main>
      </div>
    </div>
  )
}
