"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Wrench,
  MessageSquareQuote,
  Images,
  Sliders,
  LogOut,
  ArrowLeft,
  Calendar,
  Boxes,
  Shield,
  Loader2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT_MINUTES = 30;
const IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MINUTES * 60 * 1000;

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check current session
  useEffect(() => {
    if (isLoginPage) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login");
      } else if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  // Session timeout detection
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    } finally {
      localStorage.removeItem("stg_admin_last_activity");
      router.push("/admin/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }, [router]);

  useEffect(() => {
    if (isLoginPage) return;

    function updateActivity() {
      localStorage.setItem("stg_admin_last_activity", Date.now().toString());
    }

    function checkInactivity() {
      const lastActivity = localStorage.getItem("stg_admin_last_activity");
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > IDLE_TIMEOUT_MS) {
          alert(`Your admin session timed out after ${IDLE_TIMEOUT_MINUTES} minutes of inactivity.`);
          handleLogout();
        }
      }
    }

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    const interval = setInterval(checkInactivity, 60 * 1000);
    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      clearInterval(interval);
    };
  }, [isLoginPage, handleLogout]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Enquiries", href: "/admin/enquiries", icon: Inbox, highlight: true },
    { label: "Services", href: "/admin/services", icon: Wrench },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Gallery", href: "/admin/gallery", icon: Images },
    { label: "Site Settings", href: "/admin/settings", icon: Sliders },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Products", href: "/admin/products", icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-green rounded-full animate-pulse" />
              <span className="font-bold text-xs tracking-wider uppercase text-green">
                Admin Console
              </span>
            </div>
            <h1 className="text-base font-bold text-white truncate">{BUSINESS.shortName}</h1>
            <span className="text-[11px] text-white/50">{BUSINESS.licence}</span>
          </div>

          {/* User Email Pill */}
          {userEmail && (
            <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
              <Shield size={14} className="text-green flex-shrink-0" />
              <div className="truncate">
                <p className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Signed In As</p>
                <p className="text-xs font-mono text-white/90 truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green text-navy font-bold shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-navy" : "text-green-light"} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-green" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Return to site & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin text-red-300" />
            ) : (
              <LogOut size={16} />
            )}
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
