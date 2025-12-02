"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { useApp } from "@/context/AppContext"
import { validateProductData, formatValidationError, getFieldError } from "@/utils/productValidation"

export default function AddProductPage() {
  const router = useRouter()
  const { handleAddProduct } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    materialOfConstruction: "",
    capType: "",
    imageUrl: "",
    description: "",
    variants: [
      {
        sizeLabel: "",
        brimfulCapacity: "",
        neckSize: "",
        totalHeight: "",
        diameter: "",
        labelHeight: "",
        standardWeight: "",
      },
    ],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index][field] = value
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }))
  }

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sizeLabel: "",
          brimfulCapacity: "",
          neckSize: "",
          totalHeight: "",
          diameter: "",
          labelHeight: "",
          standardWeight: "",
        },
      ],
    }))
  }

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    // Validate product data
    const validation = validateProductData(formData, imageFile)
    
    if (!validation.isValid) {
      setError(validation.error.message)
      if (validation.error.field) {
        setFieldErrors({ [validation.error.field]: validation.error.message })
      }
      setLoading(false)
      
      // Scroll to error
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    try {
      await handleAddProduct(validation.data, imageFile)
      router.push("/products")
    } catch (err) {
      const errorMessage = err.message || "Failed to add product. Please try again."
      setError(errorMessage)
      
      // Scroll to error
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push("/products")}
                className="p-2 hover:bg-secondary rounded transition-colors"
              >
                <ArrowLeft size={24} className="text-foreground" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
                <p className="text-muted-foreground mt-1">Create a new product in your catalog</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="font-medium">Validation Error</p>
                  <p className="text-sm mt-1 whitespace-pre-line">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
              {/* Basic Information */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., PET Bottle"
                    required
                    className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      fieldErrors.name ? "border-red-500" : "border-input"
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Material of Construction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="materialOfConstruction"
                      value={formData.materialOfConstruction}
                      onChange={handleInputChange}
                      placeholder="e.g., PET, HDPE"
                      required
                      className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        fieldErrors.materialOfConstruction ? "border-red-500" : "border-input"
                      }`}
                    />
                    {fieldErrors.materialOfConstruction && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.materialOfConstruction}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cap Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="capType"
                      value={formData.capType}
                      onChange={handleInputChange}
                      placeholder="e.g., Screw Cap, Flip Top"
                      required
                      className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        fieldErrors.capType ? "border-red-500" : "border-input"
                      }`}
                    />
                    {fieldErrors.capType && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.capType}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description..."
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                      fieldErrors.description ? "border-red-500" : "border-input"
                    }`}
                  />
                  {fieldErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.description}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors ${
                    fieldErrors.image ? "border-red-500" : "border-border"
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="hidden"
                      id="image"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                  {fieldErrors.image && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.image}</p>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">Product Variants</h2>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Variant
                  </button>
                </div>

                {fieldErrors.variants && (
                  <p className="text-red-600 text-sm">{fieldErrors.variants}</p>
                )}

                {formData.variants.map((variant, index) => (
                  <div key={index} className={`border rounded-lg p-4 space-y-4 ${
                    fieldErrors[`variant_${index}`] ? "border-red-500" : "border-border"
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-foreground">Variant {index + 1}</h3>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {fieldErrors[`variant_${index}`] && (
                      <p className="text-red-600 text-sm mb-2">{fieldErrors[`variant_${index}`]}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Size Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.sizeLabel}
                          onChange={(e) => handleVariantChange(index, "sizeLabel", e.target.value)}
                          placeholder="e.g., 500ml"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Brimful Capacity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.brimfulCapacity}
                          onChange={(e) => handleVariantChange(index, "brimfulCapacity", e.target.value)}
                          placeholder="e.g., 530ml"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Neck Size <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.neckSize}
                          onChange={(e) => handleVariantChange(index, "neckSize", e.target.value)}
                          placeholder="e.g., 28mm"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Total Height <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.totalHeight}
                          onChange={(e) => handleVariantChange(index, "totalHeight", e.target.value)}
                          placeholder="e.g., 205mm"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Diameter <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.diameter}
                          onChange={(e) => handleVariantChange(index, "diameter", e.target.value)}
                          placeholder="e.g., 65mm"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Label Height <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.labelHeight}
                          onChange={(e) => handleVariantChange(index, "labelHeight", e.target.value)}
                          placeholder="e.g., 120mm"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Standard Weight <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.standardWeight}
                          onChange={(e) => handleVariantChange(index, "standardWeight", e.target.value)}
                          placeholder="e.g., 22g"
                          required
                          className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/products")}
                  className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
