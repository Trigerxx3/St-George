"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { EnquiryStatus } from "@/lib/supabase/types";
import {
  Inbox,
  Search,
  CheckCircle,
  Clock,
  PhoneCall,
  FileCheck,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ChevronDown,
  Trash2,
} from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  suburb: string | null;
  service_type: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(`Failed to load enquiries: ${error.message}`);
      } else {
        setEnquiries(data || []);
      }
    } catch (err) {
      setErrorMsg(errorMessage(err) || "Error loading enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: EnquiryStatus) => {
    setUpdatingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        alert(`Failed to update status: ${error.message}`);
      } else {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (e) {
      alert(`Error updating: ${errorMessage(e)}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEnquiry = async (id: string, customerName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the enquiry from "${customerName}"?`)) {
      return;
    }

    try {
      // 1. Try deleting via Supabase Client
      const supabase = createClient();
      const { error } = await supabase.from("enquiries").delete().eq("id", id);

      if (error) {
        // Fallback to server API endpoint
        const res = await fetch("/api/admin/enquiries", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || error.message);
        }
      }

      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err}`);
    }
  };

  const handleClearAllEnquiries = async () => {
    if (enquiries.length === 0) return;
    const confirmText = prompt(
      `CAUTION: You are about to permanently delete all ${enquiries.length} customer enquiries before production.\n\nType "DELETE" below to confirm:`
    );
    if (confirmText !== "DELETE") {
      if (confirmText !== null) alert("Action cancelled. You must type 'DELETE' exactly to confirm.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // Fallback via Supabase client
        const supabase = createClient();
        const { error } = await supabase.from("enquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (error) throw new Error(error.message);
      }

      setEnquiries([]);
      setSelectedEnquiry(null);
      alert("All test enquiries have been successfully cleared.");
    } catch (err: any) {
      alert(`Clear all failed: ${err.message || err}`);
      await fetchEnquiries();
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      (item.suburb && item.suburb.toLowerCase().includes(q)) ||
      (item.service_type && item.service_type.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200"><Clock size={12} /> New</span>;
      case "contacted":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><PhoneCall size={12} /> Contacted</span>;
      case "quoted":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><FileCheck size={12} /> Quoted</span>;
      case "closed":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"><CheckCircle size={12} /> Closed</span>;
    }
  };

  const statusCounts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  // Export Enquiries to Excel (.csv with UTF-8 BOM for Microsoft Excel)
  const exportToExcel = (itemsToExport: Enquiry[], filterLabel = "all") => {
    if (itemsToExport.length === 0) {
      alert("No enquiries to export.");
      return;
    }

    const headers = [
      "Enquiry Reference ID",
      "Date Received",
      "Time Received",
      "Customer Name",
      "Email Address",
      "Phone Number",
      "Suburb / Location",
      "Service Requested",
      "Inquiry Status",
      "Customer Message / Notes",
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (val === null || val === undefined) return '""';
      // Normalize line breaks and double escape quotes
      const cleaned = String(val).replace(/"/g, '""');
      return `"${cleaned}"`;
    };

    const rows = itemsToExport.map((item) => {
      const d = new Date(item.created_at);
      const datePart = d.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const timePart = d.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return [
        escapeCsv(item.id),
        escapeCsv(datePart),
        escapeCsv(timePart),
        escapeCsv(item.name),
        escapeCsv(item.email),
        // Prefix with \t (tab) to guarantee Excel treats phone numbers as text and preserves leading zeroes (04xx xxx xxx)
        escapeCsv(`\t${item.phone}`),
        escapeCsv(item.suburb || "Canberra Region"),
        escapeCsv(item.service_type || "General Enquiry"),
        escapeCsv(item.status.toUpperCase()),
        escapeCsv(item.message),
      ].join(",");
    });

    // \uFEFF Byte Order Mark ensures Microsoft Excel displays UTF-8 characters cleanly
    const csvContent = "\uFEFF" + [headers.map((h) => `"${h}"`).join(","), ...rows].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `st-george-enquiries-${filterLabel}-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const isFiltered = filterStatus !== "all" || Boolean(searchQuery);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight flex items-center gap-2.5" style={{ fontFamily: "var(--font-heading)" }}>
            <Inbox className="text-orange-strong" size={28} />
            Customer Enquiries &amp; Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time customer inquiries from website contact, quote, and booking request forms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative">
          {/* Export to Excel Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (!isFiltered) {
                  exportToExcel(enquiries, "all");
                } else {
                  setShowExportMenu((prev) => !prev);
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-orange-strong hover:bg-orange text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer border-0"
              title="Export enquiries to Excel spreadsheet"
            >
              <FileSpreadsheet size={15} />
              <span>Export to Excel</span>
              {isFiltered ? (
                <ChevronDown size={14} className={showExportMenu ? "rotate-180 transition-transform" : ""} />
              ) : (
                <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
                  {enquiries.length}
                </span>
              )}
            </button>

            {/* Dropdown for Filtered vs All */}
            {showExportMenu && isFiltered && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => exportToExcel(filteredEnquiries, "filtered")}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download size={13} className="text-orange-strong" />
                    <span className="font-semibold text-[#071522]">Export Filtered Leads</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                    {filteredEnquiries.length}
                  </span>
                </button>

                <button
                  onClick={() => exportToExcel(enquiries, "all")}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download size={13} className="text-slate-400" />
                    <span className="text-slate-600">Export All Enquiries</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                    {enquiries.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {enquiries.length > 0 && (
            <button
              onClick={handleClearAllEnquiries}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              title="Delete all customer enquiries before production"
            >
              <Trash2 size={14} className="text-red-500" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={fetchEnquiries}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-orange-strong" : "text-slate-400"} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
          <AlertCircle className="flex-shrink-0 text-amber-600 mt-0.5" size={18} />
          <div>
            <p className="font-semibold">Notice</p>
            <p className="text-xs text-amber-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "contacted", "quoted", "closed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5 cursor-pointer ${
                filterStatus === st
                  ? "bg-orange-strong text-white shadow-md shadow-orange-strong/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#071522]"
              }`}
            >
              <span>{st}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterStatus === st ? "bg-white/20 text-white font-extrabold" : "bg-white/60 text-slate-600"}`}>
                {statusCounts[st]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, suburb..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071522] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-strong focus:border-transparent"
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-orange-strong" />
            <span className="text-sm">Loading enquiries...</span>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Inbox size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-[#071522]">No enquiries found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {enquiries.length === 0
                ? "No customer inquiries have been submitted yet."
                : "No enquiries match your current filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Service &amp; Suburb</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#071522]">
                      <div>{enq.name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400" />
                        <a href={`mailto:${enq.email}`} className="hover:text-orange-strong hover:underline">
                          {enq.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone size={12} className="text-slate-400" />
                        <a href={`tel:${enq.phone}`} className="hover:text-orange-strong">
                          {enq.phone}
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-medium text-[#071522]">{enq.service_type || "General Inquiry"}</span>
                      {enq.suburb && (
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {enq.suburb}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(enq.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <select
                        value={enq.status}
                        disabled={updatingId === enq.id}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value as EnquiryStatus)}
                        className="py-1 px-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-strong disabled:opacity-50 cursor-pointer"
                      >
                        <option value="new">Mark New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="quoted">Mark Quoted</option>
                        <option value="closed">Mark Closed</option>
                      </select>

                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleDeleteEnquiry(enq.id, enq.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer inline-flex items-center align-middle"
                        title="Delete enquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for full detail view */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-[#071522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#071522]">{selectedEnquiry.name}</h3>
                <p className="text-xs text-slate-500">
                  Received {new Date(selectedEnquiry.created_at).toLocaleString("en-AU")}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-orange-strong">
                    {selectedEnquiry.phone}
                  </a>
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email</span>
                <p className="font-semibold text-slate-800 mt-0.5 truncate">
                  <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-orange-strong">
                    {selectedEnquiry.email}
                  </a>
                </p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Service Requested</span>
                <p className="font-semibold text-[#071522] mt-0.5">{selectedEnquiry.service_type || "General"}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px]">Suburb</span>
                <p className="font-semibold text-[#071522] mt-0.5">{selectedEnquiry.suburb || "Not provided"}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-500 uppercase font-bold text-[11px] block mb-1">
                Customer Message
              </span>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current status:</span>
                {getStatusBadge(selectedEnquiry.status)}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteEnquiry(selectedEnquiry.id, selectedEnquiry.name)}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-red-200 inline-flex items-center gap-1.5"
                >
                  <Trash2 size={13} className="text-red-500" />
                  <span>Delete</span>
                </button>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Regarding your enquiry - St George Electrical`}
                  className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl"
                >
                  Reply by Email
                </a>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
