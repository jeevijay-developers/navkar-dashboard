"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"

export default function EditProductModal({ product, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    materialOfConstruction: "",
    capType: "",
    description: "",
    variants: [],
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        materialOfConstruction: product.materialOfConstruction || "",
        capType: product.capType || "",
        description: product.description || "",
        variants: product.variants || [],
      })
      setImagePreview(product.imageUrl || null)
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setFormData((prev) => ({ ...prev, variants: updatedVariants }))
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
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await onSave(product._id, formData, imageFile)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to update product")
    }
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-border"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to keep current image
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>

              {formData.variants.map((variant, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-foreground">Variant {index + 1}</h4>
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

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Size Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.sizeLabel}
                        onChange={(e) => handleVariantChange(index, "sizeLabel", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Brimful Capacity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.brimfulCapacity}
                        onChange={(e) => handleVariantChange(index, "brimfulCapacity", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Neck Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.neckSize}
                        onChange={(e) => handleVariantChange(index, "neckSize", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Total Height <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.totalHeight}
                        onChange={(e) => handleVariantChange(index, "totalHeight", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Diameter <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.diameter}
                        onChange={(e) => handleVariantChange(index, "diameter", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Label Height <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.labelHeight}
                        onChange={(e) => handleVariantChange(index, "labelHeight", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Standard Weight <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.standardWeight}
                        onChange={(e) => handleVariantChange(index, "standardWeight", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.variants.length === 0 && (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">No variants added yet</p>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-2 text-primary hover:underline text-sm"
                  >
                    Add your first variant
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-border bg-secondary/50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-foreground font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
