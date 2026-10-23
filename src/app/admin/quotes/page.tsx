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
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Quote Requests &amp; Leads
          </h1>
          <p className="text-gray-500 text-sm">
            Manage incoming customer inquiries, update pipeline status, and access customer contact details.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer, suburb, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !pl-9 !py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400">Status:</span>
          {["all", "new", "contacted", "quoted", "won"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Service &amp; Property</th>
                <th className="p-4">Quarterly Bill</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80">
                  <td className="p-4 font-mono font-bold text-navy">{item.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-navy">{item.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{item.email}</div>
                    <div className="text-[11px] text-gray-500">{item.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-navy block">{item.service}</span>
                    <span className="text-[11px] text-gray-500">
                      {item.property} · {item.suburb}, {item.postcode}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.bill}</td>
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border cursor-pointer ${
                        item.status === "new"
                          ? "bg-green/10 text-green border-green/30"
                          : item.status === "contacted"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : item.status === "quoted"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : item.status === "won"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="won">Won (Scheduled)</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="p-4 text-gray-400">{item.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${item.phone.replace(/\s+/g, "")}`}
                        className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-green hover:text-white transition-colors"
                        title="Call Customer"
                      >
                        <Phone size={14} />
                      </a>
                      <a
                        href={`mailto:${item.email}`}
                        className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-navy hover:text-white transition-colors"
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
