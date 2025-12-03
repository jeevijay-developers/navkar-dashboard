"use client"

import { createContext, useContext, useState, useEffect } from "react"
import serverAPI from "@/util/server"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quotations, setQuotations] = useState([])
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

  // Fetch products from API on mount and when authenticated
  useEffect(() => {
    fetchProducts()
    fetchQuotations()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchQuotations()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await serverAPI.getProducts()
      console.log("Fetched products from API:", data)
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await serverAPI.getQuotations({ limit: 100 })
      console.log("Fetched quotations from API:", data)
      setQuotations(data.quotations || [])
    } catch (err) {
      setError(err.message)
      console.error("Failed to fetch quotations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData, imageFile = null) => {
    try {
      setLoading(true)
      setError(null)
      
      let newProduct
      if (imageFile) {
        newProduct = await serverAPI.createProductWithImage(productData, imageFile)
      } else if (productData.imageUrl) {
        newProduct = await serverAPI.createProduct(productData)
      } else {
        throw new Error("Product image is required")
      }
      
      setProducts([newProduct, ...products])
      return newProduct
    } catch (err) {
      setError(err.message)
      console.error("Failed to add product:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (id, productData, imageFile = null) => {
    try {
      setLoading(true)
      setError(null)
      
      let updatedProduct
      if (imageFile) {
        updatedProduct = await serverAPI.updateProductWithImage(id, productData, imageFile)
      } else {
        updatedProduct = await serverAPI.updateProduct(id, productData)
      }
      
      setProducts(products.map((p) => (p._id === id ? updatedProduct : p)))
      return updatedProduct
    } catch (err) {
      setError(err.message)
      console.error("Failed to update product:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await serverAPI.deleteProduct(id)
      setProducts(products.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.message)
      console.error("Failed to delete product:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpload = async (file) => {
    try {
      setLoading(true)
      setError(null)
      const result = await serverAPI.bulkUploadProducts(file)
      await fetchProducts() // Refresh the product list
      return result
    } catch (err) {
      setError(err.message)
      console.error("Failed to bulk upload products:", err)
      throw err
    } finally {
      setLoading(false)
    }
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

  const handleCreateQuotation = async (quotationData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await serverAPI.createQuotation(quotationData)
      await fetchQuotations() // Refresh quotations list
      return result
    } catch (err) {
      setError(err.message)
      console.error("Failed to create quotation:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleResendWhatsApp = async (quotationId, options) => {
    try {
      setLoading(true)
      setError(null)
      const result = await serverAPI.resendQuotationWhatsApp(quotationId, options)
      await fetchQuotations() // Refresh quotations list
      return result
    } catch (err) {
      setError(err.message)
      console.error("Failed to resend WhatsApp:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        products,
        setProducts,
        quotations,
        loading,
        error,
        fetchProducts,
        fetchQuotations,
        leads,
        setLeads,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleBulkUpload,
        handleExportLeads,
        handleCreateQuotation,
        handleResendWhatsApp,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
