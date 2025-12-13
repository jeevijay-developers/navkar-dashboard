"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { setIsAuthenticated } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    toast.success("Successfully logged out");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { id: "products", label: "Products", icon: Package, href: "/products" },
    { id: "leads", label: "Quotation", icon: MessageSquare, href: "/leads" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border flex flex-col items-center">
        <div className="w-25 h-25 relative mb-2">
          <Image
            src="/navkarEcom.png"
            alt="Navkar Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#282965] text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight size={18} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
        <div className="text-xs text-muted-foreground space-y-2 mt-4">
          <p className="text-center">© 2025 Navkar</p>
          <p className="text-center">Admin Dashboard v1.0</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Logout
              </h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from the admin dashboard?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                No, Stay Logged In
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
