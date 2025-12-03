"use client"

import { useState } from "react"
import { Search, Download, Eye, FileText, Mail, Phone } from "lucide-react"

export default function Leads({ quotations, onViewDetail, onExport, loading }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const statuses = ["All", "draft", "sent", "viewed", "accepted", "rejected", "expired"]

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.userDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.userDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.userDetails?.phone?.includes(searchQuery) ||
      quotation.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "All" || quotation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      viewed: "bg-purple-100 text-purple-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      expired: "bg-orange-100 text-orange-700",
    }
    return statusColors[status] || "bg-gray-100 text-gray-700"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  return (
    <div className="p-6 space-y-6">{/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer quotations</p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-[#282965] text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium"
        >
          <Download size={20} />
          Export Quotations
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative md:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by quotation number, name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:w-1/3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading quotations...</p>
        </div>
      )}

      {/* Quotations Table */}
      {!loading && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quotation #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="font-medium text-foreground">{quotation.quotationNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{quotation.userDetails?.name || "N/A"}</p>
                        {quotation.userDetails?.companyName && (
                          <p className="text-xs text-muted-foreground">{quotation.userDetails.companyName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {quotation.userDetails?.email && (
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <Mail size={12} className="text-muted-foreground" />
                            <span className="text-xs">{quotation.userDetails.email}</span>
                          </div>
                        )}
                        {quotation.userDetails?.phone && (
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <Phone size={12} className="text-muted-foreground" />
                            <span className="text-xs">{quotation.userDetails.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground text-sm">
                      {quotation.items?.length || 0} item{quotation.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {formatCurrency(quotation.pricing?.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quotation.status)}`}>
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {formatDate(quotation.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetail(quotation)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                        title="View details"
                      >
                        <Eye size={18} className="text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuotations.length === 0 && !loading && (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">No quotations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
