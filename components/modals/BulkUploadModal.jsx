"use client"

import { useState } from "react"
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function BulkUploadModal({ onClose, onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file) => {
    setError(null)
    
    // Check file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!validTypes.includes(file.type)) {
      setError("Please upload a CSV or Excel file (.csv, .xls, .xlsx)")
      return
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    try {
      setError(null)
      const result = await onUpload(selectedFile)
      setUploadResult(result)
    } catch (err) {
      setError(err.message || "Failed to upload file. Please try again.")
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Bulk Upload Products</h2>
              <p className="text-sm text-muted-foreground">Upload multiple products using CSV or Excel file</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">File Format Requirements:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>File must be in CSV or Excel format (.csv, .xls, .xlsx)</li>
              <li>Maximum file size: 5MB</li>
              <li>Required columns: Product Name, Material of Construction, Cap Type, Image URL, Size Label</li>
              <li>Optional columns: Description, Brimful Capacity, Neck Size, Total Height, Diameter, Label Height, Standard Weight</li>
              <li>Multiple variants for the same product should be on separate rows</li>
            </ul>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900 mb-2">Upload Successful!</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <p>Total Rows: {uploadResult.summary?.totalRows || 0}</p>
                    <p>Valid Rows: {uploadResult.summary?.validRows || 0}</p>
                    <p>Products Inserted: {uploadResult.summary?.inserted || 0}</p>
                    <p>Products Updated: {uploadResult.summary?.updated || 0}</p>
                    {uploadResult.summary?.failedProducts > 0 && (
                      <p className="text-red-600">Failed Products: {uploadResult.summary.failedProducts}</p>
                    )}
                    {uploadResult.summary?.skippedRows > 0 && (
                      <p className="text-yellow-600">Skipped Rows: {uploadResult.summary.skippedRows}</p>
                    )}
                  </div>
                  
                  {/* Failed Products Details */}
                  {uploadResult.summary?.failedProductDetails?.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                      <p className="font-medium text-red-900 mb-2">Failed Products:</p>
                      <ul className="text-xs text-red-800 space-y-1 max-h-40 overflow-y-auto">
                        {uploadResult.summary.failedProductDetails.map((failed, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{failed.product}</span> (Rows: {failed.rows?.join(', ')})
                            <br />
                            <span className="text-red-600">Reason: {failed.reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Skipped Rows Details */}
                  {uploadResult.summary?.skippedRowDetails?.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="font-medium text-yellow-900 mb-2">Skipped Rows:</p>
                      <ul className="text-xs text-yellow-800 space-y-1 max-h-40 overflow-y-auto">
                        {uploadResult.summary.skippedRowDetails.map((skipped, idx) => (
                          <li key={idx}>
                            Row {skipped.row}: {skipped.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          {!uploadResult && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-upload-file"
                disabled={loading}
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 text-green-600">
                    <FileSpreadsheet size={48} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                    disabled={loading}
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <label htmlFor="bulk-upload-file" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground mb-4">
                    <FileSpreadsheet size={48} />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and Excel files up to 5MB
                  </p>
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          {uploadResult ? (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
