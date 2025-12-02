const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ServerAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
    }

    // Only set Content-Type header for non-FormData requests
    if (!(options.body instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      }
    } else {
      // For FormData, let the browser set the Content-Type with boundary
      config.headers = {
        ...options.headers,
      }
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`)
      const response = await fetch(url, config)
      
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text }
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status}`, data)
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      console.log(`API Response: Success`, data)
      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Product API Methods

  /**
   * Get all products
   * @returns {Promise<Array>} List of products
   */
  async getProducts() {
    return this.request("/products")
  }

  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(id) {
    return this.request(`/products/${id}`)
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {string} productData.name - Product name
   * @param {string} productData.materialOfConstruction - Material
   * @param {string} productData.capType - Cap type
   * @param {string} productData.imageUrl - Image URL
   * @param {string} [productData.description] - Product description
   * @param {Array} productData.variants - Product variants
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Success message
   */
  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  /**
   * Bulk upload products from CSV/XLSX file
   * @param {File} file - CSV or XLSX file
   * @returns {Promise<Object>} Bulk upload summary
   */
  async bulkUploadProducts(file) {
    const formData = new FormData()
    formData.append("file", file)

    return this.request("/products/bulk-upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  /**
   * Upload product with image file
   * @param {Object} productData - Product data
   * @param {File} imageFile - Image file
   * @returns {Promise<Object>} Created product
   */
  async createProductWithImage(productData, imageFile) {
    const formData = new FormData()
    
    // Append product data
    Object.keys(productData).forEach((key) => {
      if (key === "variants") {
        formData.append(key, JSON.stringify(productData[key]))
      } else {
        formData.append(key, productData[key])
      }
    })
    
    // Append image file if provided
    if (imageFile) {
      formData.append("image", imageFile)
    }

    return this.request("/products", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  /**
   * Update product with image file
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @param {File} [imageFile] - Optional new image file
   * @returns {Promise<Object>} Updated product
   */
  async updateProductWithImage(id, productData, imageFile = null) {
    const formData = new FormData()
    
    // Append product data
    Object.keys(productData).forEach((key) => {
      if (key === "variants") {
        formData.append(key, JSON.stringify(productData[key]))
      } else {
        formData.append(key, productData[key])
      }
    })
    
    // Append image file if provided
    if (imageFile) {
      formData.append("image", imageFile)
    }

    return this.request(`/products/${id}`, {
      method: "PUT",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }
}

// Create and export a singleton instance
const serverAPI = new ServerAPI()

export default serverAPI

// Named exports for convenience
export const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  createProductWithImage,
  updateProductWithImage,
} = serverAPI
