"use client"

import { ArrowLeft } from "lucide-react"

export default function LeadDetail({ lead, onBack }) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded transition-colors">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Details</h1>
          <p className="text-muted-foreground mt-1">View complete lead information</p>
        </div>
      </div>

      {/* Lead Details */}
      <div className="max-w-2xl space-y-6">
        {/* Contact Information */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{lead.name}</h2>
              <p className="text-muted-foreground">{lead.source}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
              <p className="text-foreground font-medium">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
              <p className="text-foreground font-medium">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Product Interested In</p>
              <p className="text-foreground font-medium">{lead.product}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Lead Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === "New"
                      ? "bg-blue-100 text-blue-700"
                      : lead.status === "Contacted"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Lead Source</p>
              <p className="text-foreground font-medium">{lead.source}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Date/Time</p>
              <p className="text-foreground font-medium">{lead.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Message</h3>
          <p className="text-foreground leading-relaxed">{lead.message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Mark as Qualified
          </button>
          <button className="flex-1 border border-border text-foreground px-6 py-2 rounded-lg hover:bg-secondary transition-colors font-medium">
            Send Follow-up
          </button>
        </div>
      </div>
    </div>
  )
}
