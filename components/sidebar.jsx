"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, MessageSquare, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { id: "products", label: "Products", icon: Package, href: "/products" },
    { id: "leads", label: "Leads", icon: MessageSquare, href: "/leads" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Navkar</h1>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight size={18} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="text-center">© 2025 Navkar</p>
          <p className="text-center">Admin Dashboard v1.0</p>
        </div>
      </div>
    </aside>
  )
}
