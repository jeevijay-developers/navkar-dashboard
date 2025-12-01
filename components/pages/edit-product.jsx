"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

export default function EditProduct({ product, onSubmit }) {
  const [formData, setFormData] = useState(product)
  const [imagePreview, setImagePreview] = useState(
    product.images.map((url, idx) => ({ name: `Image ${idx + 1}`, url })),
  )

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImagePreview(
      files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      })),
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      inventory: Number.parseInt(formData.inventory),
      images: imagePreview.map((p) => p.url),
      status: formData.status === true || formData.status === "Published" ? "Published" : "Unpublished",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-secondary rounded transition-colors">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* SKU and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Bottled Water</option>
                <option>Mineral Water</option>
                <option>Spring Water</option>
                <option>Flavored Water</option>
              </select>
            </div>
          </div>

          {/* Price and Volume */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Volume/Size *</label>
              <select
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>250ml</option>
                <option>500ml</option>
                <option>1L</option>
                <option>2L</option>
                <option>5L</option>
              </select>
            </div>
          </div>

          {/* Inventory Count */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Inventory Count *</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="images"
              />
              <label htmlFor="images" className="cursor-pointer">
                <p className="text-sm text-muted-foreground">Click to upload new images</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagePreview.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={`Preview ${idx}`}
                      className="w-full h-20 object-cover rounded border border-border"
                    />
                    <p className="text-xs text-foreground mt-1 truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={formData.status === "Published" || formData.status === true}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.checked ? "Published" : "Unpublished" }))
              }
              id="publish"
              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="publish" className="text-sm font-medium text-foreground">
              Publish this product
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Update Product
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
