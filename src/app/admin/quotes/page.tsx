"use client";

import { useState } from "react";
import {
  FileText,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";

interface QuoteItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  property: string;
  suburb: string;
  postcode: string;
  bill: string;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  notes: string;
  date: string;
}

const INITIAL_QUOTES: QuoteItem[] = [
  {
    id: "STG-Q344603",
    name: "Mark & Sandra Turner",
    phone: "0412 345 678",
    email: "mark.turner@example.com",
    service: "Solar & Battery",
    property: "House",
    suburb: "Gungahlin",
    postcode: "2912",
    bill: "$1,000 – $1,500 / quarter",
    status: "new",
    notes: "Interested in Tesla Powerwall 3 and ACT Sustainable Household Scheme 0% loan.",
    date: "23 Oct 2026, 10:45 AM",
  },
  {
    id: "STG-Q344598",
    name: "Sarah Campbell",
    phone: "0423 456 789",
    email: "s.campbell@example.com",
    service: "EV Charger",
    property: "Townhouse",
    suburb: "Belconnen",
    postcode: "2617",
    bill: "$500 – $1,000 / quarter",
    status: "contacted",
    notes: "Has a Tesla Model Y arriving next week. Needs 32A run to detached garage.",
    date: "22 Oct 2026, 3:15 PM",
  },
  {
    id: "STG-Q344582",
    name: "David O'Connor",
    phone: "0434 567 890",
    email: "david.oc@example.com",
    service: "Switchboard Upgrade",
    property: "House",
    suburb: "Woden",
    postcode: "2606",
    bill: "$500 – $1,000 / quarter",
    status: "quoted",
    notes: "Older ceramic fuse board tripping constantly. Quoted Clipsal Resi9 board.",
    date: "21 Oct 2026, 11:20 AM",
  },
  {
    id: "STG-Q344570",
    name: "Michael Peterson",
    phone: "0445 678 901",
    email: "mpeterson@example.com",
    service: "General Electrical",
    property: "Commercial",
    suburb: "Fyshwick",
    postcode: "2609",
    bill: "N/A",
    status: "won",
    notes: "Three-phase sub-board and LED warehouse high-bay installation scheduled.",
    date: "19 Oct 2026, 9:00 AM",
  },
];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>(INITIAL_QUOTES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const updateStatus = (id: string, newStatus: QuoteItem["status"]) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const filtered = quotes.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Quote Requests &amp; Leads
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage incoming customer inquiries, update pipeline status, and access customer contact details.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, suburb, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Status:</span>
          {["all", "new", "contacted", "quoted", "won"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-orange-strong text-white shadow-md shadow-orange-strong/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#071522]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Service &amp; Property</th>
                <th className="py-3.5 px-4">Quarterly Bill</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-strong">{item.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#071522]">{item.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#071522] block">{item.service}</span>
                    <span className="text-[11px] text-slate-500">
                      {item.property} · {item.suburb}, {item.postcode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{item.bill}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                        item.status === "new"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : item.status === "contacted"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : item.status === "quoted"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : item.status === "won"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="won">Won (Scheduled)</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, "")}`}
                        className="p-2 rounded-lg bg-orange-50 text-orange-strong hover:bg-orange-strong hover:text-white transition-colors border border-orange-200"
                        title="Call Customer"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={`mailto:${item.email}`}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#071522] transition-colors border border-slate-200"
                        title="Email Customer"
                      >
                        <Mail size={14} />
                      </a>
                    </div>
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
