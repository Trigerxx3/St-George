import Link from "next/link";
import {
  FileText,
  Calendar,
  Boxes,
  MessageSquareQuote,
  TrendingUp,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { PRODUCTS, PACKAGES } from "@/lib/catalogue-data";

export default function AdminDashboardPage() {
  const stats = [
    { title: "New Quote Leads", value: "8", change: "+3 this week", icon: FileText, color: "text-green" },
    { title: "Pending Bookings", value: "4", change: "2 urgent", icon: Calendar, color: "text-orange" },
    { title: "Catalogue Products", value: PRODUCTS.length.toString(), change: "Active online", icon: Boxes, color: "text-navy" },
    { title: "Turnkey Packages", value: PACKAGES.length.toString(), change: "Canberra schemes", icon: MessageSquareQuote, color: "text-blue-600" },
  ];

  const recentLeads = [
    {
      id: "STG-Q344603",
      name: "Mark T.",
      service: "Solar & Battery",
      property: "House (Gungahlin)",
      phone: "0412 345 678",
      status: "New",
      date: "Today, 10:45 AM",
    },
    {
      id: "STG-Q344598",
      name: "Sarah C.",
      service: "EV Charger",
      property: "Townhouse (Belconnen)",
      phone: "0423 456 789",
      status: "Contacted",
      date: "Yesterday",
    },
    {
      id: "STG-Q344582",
      name: "David O.",
      service: "Switchboard Upgrade",
      property: "House (Woden)",
      phone: "0434 567 890",
      status: "Quoted",
      date: "2 days ago",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Owner Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome, Justin George. Here is a summary of your website lead generation and service requests.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/quotes" className="btn-primary !py-2 !px-4 text-xs">
            Review Leads
          </Link>
          <Link href="/admin/bookings" className="btn-outline !py-2 !px-4 text-xs !text-navy !border-navy hover:!bg-navy hover:!text-white">
            View Bookings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">{s.title}</span>
                <Icon size={18} className={s.color} />
              </div>
              <div className="text-3xl font-extrabold text-navy font-mono mb-1">{s.value}</div>
              <span className="text-xs text-green font-medium">{s.change}</span>
            </div>
          );
        })}
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy">Recent Quote Inquiries</h2>
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-green hover:underline inline-flex items-center gap-1"
          >
            View All Leads <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/80">
                  <td className="p-4 font-mono font-bold text-navy">{lead.id}</td>
                  <td className="p-4 font-medium text-navy">
                    <div>{lead.name}</div>
                    <span className="text-[11px] text-gray-400">{lead.phone}</span>
                  </td>
                  <td className="p-4">{lead.service}</td>
                  <td className="p-4 text-gray-500">{lead.property}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        lead.status === "New"
                          ? "bg-green/10 text-green"
                          : lead.status === "Contacted"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{lead.date}</td>
                  <td className="p-4 text-right">
                    <a
                      href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-green/10 text-green font-semibold hover:bg-green hover:text-white transition-colors"
                    >
                      <Phone size={12} /> Call
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
