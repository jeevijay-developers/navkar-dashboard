/**
 * Product validation utilities
 * Provides user-friendly validation for product data
 */

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = "ValidationError"
    this.field = field
  }
}

/**
 * Validate product name
 */
export function validateProductName(name) {
  if (!name || typeof name !== "string") {
    throw new ValidationError("Product name is required", "name")
  }

  const trimmedName = name.trim()
  
  if (trimmedName.length === 0) {
    throw new ValidationError("Product name cannot be empty", "name")
  }

  if (trimmedName.length < 3) {
    throw new ValidationError("Product name must be at least 3 characters long", "name")
  }

  if (trimmedName.length > 100) {
    throw new ValidationError("Product name must not exceed 100 characters", "name")
  }

  return trimmedName
}

/**
 * Validate material of construction
 */
export function validateMaterial(material) {
  if (!material || typeof material !== "string") {
    throw new ValidationError("Material of construction is required", "materialOfConstruction")
  }

  const trimmedMaterial = material.trim()
  
  if (trimmedMaterial.length === 0) {
    throw new ValidationError("Material of construction cannot be empty", "materialOfConstruction")
  }

  if (trimmedMaterial.length < 2) {
    throw new ValidationError("Material must be at least 2 characters long", "materialOfConstruction")
  }

  if (trimmedMaterial.length > 50) {
    throw new ValidationError("Material must not exceed 50 characters", "materialOfConstruction")
  }

  return trimmedMaterial
}

/**
 * Validate cap type
 */
export function validateCapType(capType) {
  if (!capType || typeof capType !== "string") {
    throw new ValidationError("Cap type is required", "capType")
  }

  const trimmedCapType = capType.trim()
  
  if (trimmedCapType.length === 0) {
    throw new ValidationError("Cap type cannot be empty", "capType")
  }

  if (trimmedCapType.length < 2) {
    throw new ValidationError("Cap type must be at least 2 characters long", "capType")
  }

  if (trimmedCapType.length > 50) {
    throw new ValidationError("Cap type must not exceed 50 characters", "capType")
  }

  return trimmedCapType
}

/**
 * Validate image file
 */
export function validateImageFile(file) {
  if (!file) {
    throw new ValidationError("Product image is required. Please upload an image file.", "image")
  }

  // Check if it's a File object
  if (!(file instanceof File)) {
    throw new ValidationError("Invalid image file. Please select a valid image.", "image")
  }

  // Check file type
  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!validImageTypes.includes(file.type)) {
    throw new ValidationError(
      "Invalid image format. Please upload a JPEG, PNG, GIF, or WEBP image.",
      "image"
    )
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    throw new ValidationError(
      "Image file is too large. Please upload an image smaller than 10MB.",
      "image"
    )
  }

  // Check minimum size (1KB to avoid corrupt files)
  const minSize = 1024 // 1KB
  if (file.size < minSize) {
    throw new ValidationError("Image file is too small. Please upload a valid image.", "image")
  }

  return file
}

/**
 * Validate description (optional field)
 */
export function validateDescription(description) {
  if (!description) {
    return "" // Description is optional
  }

  if (typeof description !== "string") {
    throw new ValidationError("Description must be text", "description")
  }

  const trimmedDescription = description.trim()

  if (trimmedDescription.length > 1000) {
    throw new ValidationError("Description must not exceed 1000 characters", "description")
  }

  return trimmedDescription
}

/**
 * Validate a single variant
 */
export function validateVariant(variant, index) {
  const errors = []

  // Size Label
  if (!variant.sizeLabel || variant.sizeLabel.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Size label is required`)
  } else if (variant.sizeLabel.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Size label must not exceed 50 characters`)
  }

  // Brimful Capacity
  if (!variant.brimfulCapacity || variant.brimfulCapacity.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Brimful capacity is required`)
  } else if (variant.brimfulCapacity.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Brimful capacity must not exceed 50 characters`)
  }

  // Neck Size
  if (!variant.neckSize || variant.neckSize.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Neck size is required`)
  } else if (variant.neckSize.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Neck size must not exceed 50 characters`)
  }

  // Total Height
  if (!variant.totalHeight || variant.totalHeight.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Total height is required`)
  } else if (variant.totalHeight.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Total height must not exceed 50 characters`)
  }

  // Diameter
  if (!variant.diameter || variant.diameter.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Diameter is required`)
  } else if (variant.diameter.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Diameter must not exceed 50 characters`)
  }

  // Label Height
  if (!variant.labelHeight || variant.labelHeight.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Label height is required`)
  } else if (variant.labelHeight.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Label height must not exceed 50 characters`)
  }

  // Standard Weight
  if (!variant.standardWeight || variant.standardWeight.trim().length === 0) {
    errors.push(`Variant ${index + 1}: Standard weight is required`)
  } else if (variant.standardWeight.trim().length > 50) {
    errors.push(`Variant ${index + 1}: Standard weight must not exceed 50 characters`)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join("\n"), "variants")
  }

  return {
    sizeLabel: variant.sizeLabel.trim(),
    brimfulCapacity: variant.brimfulCapacity.trim(),
    neckSize: variant.neckSize.trim(),
    totalHeight: variant.totalHeight.trim(),
    diameter: variant.diameter.trim(),
    labelHeight: variant.labelHeight.trim(),
    standardWeight: variant.standardWeight.trim(),
  }
}

/**
 * Validate all variants
 */
export function validateVariants(variants) {
  if (!variants || !Array.isArray(variants)) {
    throw new ValidationError("At least one product variant is required", "variants")
  }

  if (variants.length === 0) {
    throw new ValidationError("Please add at least one product variant", "variants")
  }

  if (variants.length > 50) {
    throw new ValidationError("Maximum 50 variants allowed per product", "variants")
  }

  // Validate each variant
  const validatedVariants = variants.map((variant, index) => validateVariant(variant, index))

  // Check for duplicate size labels
  const sizeLabels = validatedVariants.map((v) => v.sizeLabel.toLowerCase())
  const duplicates = sizeLabels.filter((label, index) => sizeLabels.indexOf(label) !== index)
  
  if (duplicates.length > 0) {
    throw new ValidationError(
      `Duplicate size labels found: ${[...new Set(duplicates)].join(", ")}. Each variant must have a unique size label.`,
      "variants"
    )
  }

  return validatedVariants
}

/**
 * Validate complete product data
 */
export function validateProductData(productData, imageFile) {
  try {
    const validated = {
      name: validateProductName(productData.name),
      materialOfConstruction: validateMaterial(productData.materialOfConstruction),
      capType: validateCapType(productData.capType),
      description: validateDescription(productData.description),
      variants: validateVariants(productData.variants),
    }

    // Validate image
    validateImageFile(imageFile)

    return {
      isValid: true,
      data: validated,
      error: null,
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        isValid: false,
        data: null,
        error: {
          message: error.message,
          field: error.field,
        },
      }
    }
    // Re-throw unexpected errors
    throw error
  }
}

/**
 * Validate product update data (image is optional for updates)
 */
export function validateProductUpdateData(productData, imageFile = null) {
  try {
    const validated = {
      name: validateProductName(productData.name),
      materialOfConstruction: validateMaterial(productData.materialOfConstruction),
      capType: validateCapType(productData.capType),
      description: validateDescription(productData.description),
      variants: validateVariants(productData.variants),
    }

    // Validate image only if provided
    if (imageFile) {
      validateImageFile(imageFile)
    }

    return {
      isValid: true,
      data: validated,
      error: null,
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        isValid: false,
        data: null,
        error: {
          message: error.message,
          field: error.field,
        },
      }
    }
    // Re-throw unexpected errors
    throw error
  }
}

/**
 * Get field-specific error message
 */
export function getFieldError(error, fieldName) {
  if (!error || !error.field) return null
  return error.field === fieldName ? error.message : null
}

/**
 * Format validation error for display
 */
export function formatValidationError(error) {
  if (!error) return "An unknown error occurred"
  
  if (error.field) {
    return `${error.message}`
  }
  
  return error.message || "Please check your input and try again"
}
