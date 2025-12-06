"use client"

import { TrendingUp, Package, MessageSquare } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useMemo } from "react"

export default function Dashboard({ products, leads }) {
  const publishedCount = products.filter((p) => p.status === "Published").length
  
  // Calculate leads by month for the last 6 months
  const leadsChartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const last6Months = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = monthNames[date.getMonth()]
      const year = date.getFullYear()
      const monthKey = `${monthName} ${year}`
      
      const leadsCount = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt || lead.timestamp)
        return leadDate.getMonth() === date.getMonth() && 
               leadDate.getFullYear() === date.getFullYear()
      }).length
      
      last6Months.push({
        month: monthName,
        leads: leadsCount
      })
    }
    
    return last6Months
  }, [leads])

  // Calculate products by material
  const productsByMaterial = useMemo(() => {
    const materialCounts = {}
    products.forEach(product => {
      const material = product.materialOfConstruction || "Unknown"
      materialCounts[material] = (materialCounts[material] || 0) + 1
    })
    
    return Object.entries(materialCounts).map(([material, count]) => ({
      material: material.length > 15 ? material.substring(0, 15) + "..." : material,
      count
    })).slice(0, 6)
  }, [products])

  // Calculate recent leads statistics
  const recentLeadsStats = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    
    const recentLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt || lead.timestamp)
      return leadDate >= lastMonth
    })
    
    return {
      total: leads.length,
      lastMonth: recentLeads.length,
      pending: leads.filter(l => l.status === "pending").length,
      completed: leads.filter(l => l.status === "completed").length
    }
  }, [leads])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Navkar Admin Panel</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-foreground mt-2">{products.length}</p>
            </div>
            <div className="bg-[#282965]/10 p-3 rounded-lg">
              <Package className="text-[#282965]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Published Products</p>
              <p className="text-3xl font-bold text-foreground mt-2">{publishedCount}</p>
            </div>
            <div className="bg-[#282965]/10 p-3 rounded-lg">
              <TrendingUp className="text-[#282965]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Quotation</p>
              <p className="text-3xl font-bold text-foreground mt-2">{leads.length}</p>
            </div>
            <div className="bg-[#282965]/10 p-3 rounded-lg">
              <MessageSquare className="text-[#282965]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Trend Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Quotations Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="leads" stroke="#282965" strokeWidth={2} name="Quotations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Material Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Products by Material</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByMaterial}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="material" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="count" fill="#282965" name="Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm font-medium">Quotations This Month</p>
          <p className="text-2xl font-bold text-foreground mt-2">{recentLeadsStats.lastMonth}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm font-medium">Pending Quotations</p>
          <p className="text-2xl font-bold text-foreground mt-2">{recentLeadsStats.pending}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm font-medium">Completed Quotations</p>
          <p className="text-2xl font-bold text-foreground mt-2">{recentLeadsStats.completed}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm font-medium">Draft Products</p>
          <p className="text-2xl font-bold text-foreground mt-2">{products.length - publishedCount}</p>
        </div>
      </div>
      
    </div>
  )
}
