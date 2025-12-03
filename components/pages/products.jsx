"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Edit2, Trash2, Upload, X } from "lucide-react"
import EditProductModal from "@/components/modals/EditProductModal"
import BulkUploadModal from "@/components/modals/BulkUploadModal"

export default function Products({ products, onEdit, onDelete, onUpdate, onBulkUpload, loading }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [materialFilter, setMaterialFilter] = useState("All")
  const [capTypeFilter, setCapTypeFilter] = useState("All")
  const [editingProduct, setEditingProduct] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const materials = ["All", ...new Set(products.map((p) => p.materialOfConstruction).filter(Boolean))]
  const capTypes = ["All", ...new Set(products.map((p) => p.capType).filter(Boolean))]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capType?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMaterial = materialFilter === "All" || p.materialOfConstruction === materialFilter
    const matchesCapType = capTypeFilter === "All" || p.capType === capTypeFilter
    return matchesSearch && matchesMaterial && matchesCapType
  })

  const handleEditClick = (product) => {
    setEditingProduct(product)
  }

  const handleEditClose = () => {
    setEditingProduct(null)
  }

  const handleEditSave = async (productId, productData, imageFile) => {
    setUpdateLoading(true)
    try {
      await onUpdate(productId, productData, imageFile)
      setEditingProduct(null)
    } catch (error) {
      throw error
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleBulkUpload = async (file) => {
    setBulkUploadLoading(true)
    try {
      const result = await onBulkUpload(file)
      return result
    } catch (error) {
      throw error
    } finally {
      setBulkUploadLoading(false)
    }
  }

  const handleDeleteClick = (product) => {
    setDeleteConfirm(product)
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm._id)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={handleEditClose}
          onSave={handleEditSave}
          loading={updateLoading}
        />
      )}
      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onUpload={handleBulkUpload}
          loading={bulkUploadLoading}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium border border-border"
          >
            <Upload size={20} />
            Bulk Upload
          </button>
          <button
            onClick={() => router.push("/products/add")}
            className="flex items-center gap-2 bg-[#282965] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[#154c79] transition-colors font-medium"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by product name or cap type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:w-1/4">
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat === "All" ? "All Materials" : mat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-1/4">
            <select
              value={capTypeFilter}
              onChange={(e) => setCapTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {capTypes.map((cap) => (
                <option key={cap} value={cap}>
                  {cap === "All" ? "All Cap Types" : cap}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Material</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cap Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Variants</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-muted shrink-0 overflow-hidden">
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">{product.materialOfConstruction}</td>
                    <td className="px-6 py-4 text-foreground text-sm">{product.capType}</td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {product.variants?.length || 0} variant{product.variants?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">No products found</p>
              <button
                onClick={() => router.push("/products/add")}
                className="mt-4 text-primary hover:underline"
              >
                Add your first product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
