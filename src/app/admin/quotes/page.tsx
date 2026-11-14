"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not fetch enquiries for quotes:", error.message);
      } else if (data) {
        // Filter and format enquiries that are quotes or general inquiries
        const mapped: QuoteItem[] = data.map((item) => {
          // Parse property or bill info from message if present
          const propMatch = item.message?.match(/Property:\s*([^|]+)/i);
          const billMatch = item.message?.match(/Quarterly Bill:\s*([^|]+)/i);
          const notesMatch = item.message?.match(/Notes:\s*(.+)/i);

          const property = propMatch ? propMatch[1].trim() : "Residential";
          const bill = billMatch ? billMatch[1].trim() : "Not specified";
          const notes = notesMatch ? notesMatch[1].trim() : item.message;

          const suburbParts = (item.suburb || "Canberra ACT").split(" ");
          const postcode = suburbParts[suburbParts.length - 1] || "";
          const suburbName = suburbParts.slice(0, -1).join(" ") || item.suburb || "Canberra";

          let statusValue: QuoteItem["status"] = "new";
          if (item.status === "contacted") statusValue = "contacted";
          else if (item.status === "quoted") statusValue = "quoted";
          else if (item.status === "closed") statusValue = "won";

          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
            email: item.email,
            service: item.service_type || "Solar & Battery",
            property,
            suburb: suburbName,
            postcode,
            bill,
            status: statusValue,
            notes: notes || "",
            date: new Date(item.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
        setQuotes(mapped);
      }
    } catch (err) {
      console.error("Error loading quotes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: string, newStatus: QuoteItem["status"]) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );

    try {
      const supabase = createClient();
      let dbStatus = "new";
      if (newStatus === "contacted") dbStatus = "contacted";
      else if (newStatus === "quoted") dbStatus = "quoted";
      else if (newStatus === "won" || newStatus === "lost") dbStatus = "closed";

      await supabase.from("enquiries").update({ status: dbStatus }).eq("id", id);
    } catch (e) {
      console.warn("Failed to update status in DB:", e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the quote lead for "${name}"?`)) return;

    try {
      const supabase = createClient();
      await supabase.from("enquiries").delete().eq("id", id);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      alert("Delete failed. Please try again.");
    }
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

        <button
          onClick={fetchQuotes}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-orange-strong" : "text-slate-400"} />
          <span>Refresh</span>
        </button>
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
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-orange-strong" />
            <span className="text-sm">Loading quote leads...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-[#071522]">No quote requests</h3>
            <p className="text-xs text-slate-500 mt-1">
              {quotes.length === 0
                ? "Incoming customer quote submissions from the website will appear here in real time."
                : "No quotes match your current search or filter."}
            </p>
          </div>
        ) : (
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
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-strong">{item.id.slice(0, 8)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#071522]">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#071522] block">{item.service}</span>
                      <span className="text-[11px] text-slate-500">
                        {item.property} · {item.suburb}
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
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                          title="Delete quote lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
