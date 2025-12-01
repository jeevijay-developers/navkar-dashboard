"use client"

import { TrendingUp, Package, MessageSquare } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const chartData = [
  { month: "Jan", sales: 4000, leads: 2400 },
  { month: "Feb", sales: 3000, leads: 1398 },
  { month: "Mar", sales: 2000, leads: 9800 },
  { month: "Apr", sales: 2780, leads: 3908 },
  { month: "May", sales: 1890, leads: 4800 },
  { month: "Jun", sales: 2390, leads: 3800 },
]

export default function Dashboard({ products, leads }) {
  const publishedCount = products.filter((p) => p.status === "Published").length
  const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0)

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
            <div className="bg-primary/10 p-3 rounded-lg">
              <Package className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Published Products</p>
              <p className="text-3xl font-bold text-foreground mt-2">{publishedCount}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <TrendingUp className="text-accent" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Leads</p>
              <p className="text-3xl font-bold text-foreground mt-2">{leads.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leads Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Leads Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="leads" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Leads</h3>
        <div className="space-y-4">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{lead.name}</p>
                <p className="text-sm text-muted-foreground truncate">{lead.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{lead.timestamp}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
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
          ))}
        </div>
      </div>
    </div>
  )
}
