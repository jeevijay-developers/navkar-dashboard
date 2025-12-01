"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Dashboard from "@/components/pages/dashboard"
import Products from "@/components/pages/products"
import AddProduct from "@/components/pages/add-product"
import EditProduct from "@/components/pages/edit-product"
import Leads from "@/components/pages/leads"
import LeadDetail from "@/components/pages/lead-detail"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Navkar Pure Water 500ml",
      sku: "NV-500-001",
      category: "Bottled Water",
      price: 15,
      volume: "500ml",
      inventory: 450,
      status: "Published",
      images: ["/water-bottle-500ml.jpg"],
      description: "Premium pure drinking water in 500ml bottles",
    },
    {
      id: 2,
      name: "Navkar Pure Water 1L",
      sku: "NV-1L-001",
      category: "Bottled Water",
      price: 25,
      volume: "1L",
      inventory: 320,
      status: "Published",
      images: ["/water-bottle-1litre.jpg"],
      description: "Premium pure drinking water in 1 liter bottles",
    },
    {
      id: 3,
      name: "Navkar Mineral Water 500ml",
      sku: "NV-MIN-500",
      category: "Mineral Water",
      price: 20,
      volume: "500ml",
      inventory: 150,
      status: "Unpublished",
      images: ["/mineral-water.jpg"],
      description: "Natural mineral water with essential minerals",
    },
  ])
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91-9876543210",
      message: "Interested in bulk orders for corporate events",
      product: "Navkar Pure Water 1L",
      source: "Website",
      timestamp: "2024-12-01 10:30 AM",
      status: "New",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@company.com",
      phone: "+91-9123456789",
      message: "Looking for distributorship opportunities",
      product: "Navkar Mineral Water 500ml",
      source: "Email",
      timestamp: "2024-11-30 3:45 PM",
      status: "Contacted",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit@retail.com",
      phone: "+91-8765432109",
      message: "Want to stock your products in my store",
      product: "Navkar Pure Water 500ml",
      source: "Phone",
      timestamp: "2024-11-29 2:15 PM",
      status: "Qualified",
    },
  ])

  const handleAddProduct = (newProduct) => {
    const product = { ...newProduct, id: Math.max(...products.map((p) => p.id), 0) + 1 }
    setProducts([...products, product])
    setCurrentPage("products")
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setCurrentPage("products")
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleExportLeads = () => {
    const csv = [
      ["Name", "Email", "Phone", "Message", "Product", "Source", "Timestamp", "Status"],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.message,
        lead.product,
        lead.source,
        lead.timestamp,
        lead.status,
      ]),
    ]
    const csvContent = csv.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard products={products} leads={leads} />
      case "products":
        return (
          <Products
            products={products}
            onEdit={(product) => {
              setEditingProduct(product)
              setCurrentPage("edit-product")
            }}
            onDelete={handleDeleteProduct}
          />
        )
      case "add-product":
        return <AddProduct onSubmit={handleAddProduct} />
      case "edit-product":
        return editingProduct ? <EditProduct product={editingProduct} onSubmit={handleUpdateProduct} /> : null
      case "leads":
        return (
          <Leads
            leads={leads}
            onViewDetail={(lead) => {
              setSelectedLead(lead)
              setCurrentPage("lead-detail")
            }}
            onExport={handleExportLeads}
          />
        )
      case "lead-detail":
        return selectedLead ? <LeadDetail lead={selectedLead} onBack={() => setCurrentPage("leads")} /> : null
      default:
        return <Dashboard products={products} leads={leads} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">{renderPage()}</main>
      </div>
    </div>
  )
}
