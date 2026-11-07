"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Wrench,
  MessageSquareQuote,
  Images,
  Sliders,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RecentEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  suburb: string | null;
  service_type: string | null;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    newEnquiries: 0,
    totalServices: 0,
    testimonials: 0,
    galleryItems: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // 1. Fetch counts
      const [enqRes, servRes, testRes, galRes] = await Promise.all([
        supabase.from("enquiries").select("id, status, name, email, phone, suburb, service_type, created_at").order("created_at", { ascending: false }),
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("testimonials").select("id", { count: "exact" }),
        supabase.from("gallery").select("id", { count: "exact" }),
      ]);

      const enquiriesData = enqRes.data || [];
      const newEnqCount = enquiriesData.filter((e) => e.status === "new").length;

      setStats({
        newEnquiries: newEnqCount,
        totalServices: servRes.count || 0,
        testimonials: testRes.count || 0,
        galleryItems: galRes.count || 0,
      });

      setRecentEnquiries(enquiriesData.slice(0, 5));
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "New Enquiries",
      value: stats.newEnquiries.toString(),
      subtext: "Awaiting review",
      icon: Inbox,
      color: "text-orange-strong",
      bg: "bg-orange-strong/15",
      href: "/admin/enquiries",
    },
    {
      title: "Active Services",
      value: stats.totalServices.toString(),
      subtext: "Solar, EV & Electrical",
      icon: Wrench,
      color: "text-blue-400",
      bg: "bg-blue-400/15",
      href: "/admin/services",
    },
    {
      title: "Published Reviews",
      value: stats.testimonials.toString(),
      subtext: "Verified customer ratings",
      icon: MessageSquareQuote,
      color: "text-amber-400",
      bg: "bg-amber-400/15",
      href: "/admin/testimonials",
    },
    {
      title: "Gallery Projects",
      value: stats.galleryItems.toString(),
      subtext: "Installed photos in cloud",
      icon: Images,
      color: "text-purple-400",
      bg: "bg-purple-400/15",
      href: "/admin/gallery",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Administrator Control Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time management for St George Electrical customer leads, services, and web content.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-orange-strong" : "text-slate-500"} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/enquiries"
            className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>Review Enquiries</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-strong/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon size={18} className={card.color} />
                </div>
              </div>
              <div className="text-3xl font-black text-[#071522] font-mono mb-1">
                {isLoading ? "..." : card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 group-hover:text-orange-strong transition-colors">
                <span>{card.subtext}</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Inbox className="text-orange-strong" size={20} />
            <h2 className="text-base font-bold text-[#071522]">Recent Customer Inquiries</h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-orange-strong hover:text-orange-light flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-orange-strong" />
            <span>Loading recent activity...</span>
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No customer enquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#071522]">{enq.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{enq.email}</div>
                      <div className="text-[11px] font-mono text-slate-400">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#071522]">{enq.service_type || "General"}</span>
                      {enq.suburb && <div className="text-[11px] text-slate-400">{enq.suburb}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(enq.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                        enq.status === "new"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : enq.status === "contacted"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : enq.status === "quoted"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="text-xs font-bold text-orange-strong hover:text-orange-light transition-colors"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/services"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-orange-strong/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Wrench size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071522] group-hover:text-orange-strong transition-colors">
              Manage Services
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit services, categories, and sort orders.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/gallery"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-orange-strong/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Images size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071522] group-hover:text-orange-strong transition-colors">
              Cloud Photo Gallery
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload job photos to Supabase Storage and manage public showcase.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-orange-strong/50 hover:shadow-md transition-all flex items-start gap-3.5 group"
        >
          <div className="p-3 bg-orange-50 text-orange-strong rounded-xl group-hover:bg-orange-strong group-hover:text-white transition-colors">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071522] group-hover:text-orange-strong transition-colors">
              Site Settings &amp; Contact
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update phone numbers, email, hours, and licence numbers.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
