"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Products from "@/components/pages/products"
import { useApp } from "@/context/AppContext"

export default function ProductsPage() {
  const { products, handleDeleteProduct, handleUpdateProduct, handleBulkUpload, loading, fetchProducts } = useApp()
  const router = useRouter()

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          <Products
            products={products}
            loading={loading}
            onEdit={(product) => {
              router.push(`/products/edit/${product._id}`)
            }}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            onBulkUpload={handleBulkUpload}
          />
        </main>
      </div>
    </div>
  )
}
