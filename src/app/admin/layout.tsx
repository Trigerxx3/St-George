import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Package,
  Boxes,
  MessageSquareQuote,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Quotes / Leads", href: "/admin/quotes", icon: FileText, badge: "New" },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Products", href: "/admin/products", icon: Boxes },
    { label: "Packages", href: "/admin/packages", icon: Package },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-green rounded-full" />
              <span className="font-bold text-sm tracking-wider uppercase text-white/90">
                Admin Control
              </span>
            </div>
            <h1 className="text-lg font-bold text-white truncate">{BUSINESS.shortName}</h1>
            <span className="text-xs text-white/50">Licence #{BUSINESS.licence}</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-green-light" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-green text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Live Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
