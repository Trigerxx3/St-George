"use client";

import { useState, useEffect } from "react";
import { Calendar, Phone, Mail, Clock, AlertTriangle, CheckCircle2, Trash2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  urgency: "urgent" | "normal" | "flexible";
  preferredDate: string;
  preferredTime: string;
  address: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  description: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .ilike("service_type", "%Booking%")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not fetch bookings:", error.message);
      } else if (data) {
        const mapped: BookingRecord[] = data.map((item) => {
          // Parse urgency, preferred date/time, and address from message if present
          const urgencyMatch = item.message?.match(/Urgency:\s*([^|]+)/i);
          const prefMatch = item.message?.match(/Preferred:\s*([^(]+)\s*\(([^)]+)\)/i);
          const addressMatch = item.message?.match(/Address:\s*([^|]+)/i);
          const jobMatch = item.message?.match(/Job:\s*(.+)/i);

          const urgencyStr = urgencyMatch ? urgencyMatch[1].trim().toLowerCase() : "normal";
          let urgencyVal: BookingRecord["urgency"] = "normal";
          if (urgencyStr.includes("urgent")) urgencyVal = "urgent";
          else if (urgencyStr.includes("flexible")) urgencyVal = "flexible";

          const preferredDate = prefMatch ? prefMatch[1].trim() : "Flexible";
          const preferredTime = prefMatch ? prefMatch[2].trim() : "anytime";
          const address = addressMatch ? addressMatch[1].trim() : (item.suburb || "Canberra Region");
          const description = jobMatch ? jobMatch[1].trim() : item.message;

          let statusVal: BookingRecord["status"] = "pending";
          if (item.status === "contacted") statusVal = "confirmed";
          else if (item.status === "closed") statusVal = "completed";

          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
            email: item.email,
            service: (item.service_type || "Electrical Service").replace(/^Booking:\s*/i, ""),
            urgency: urgencyVal,
            preferredDate,
            preferredTime,
            address,
            status: statusVal,
            description,
          };
        });
        setBookings(mapped);
      }
    } catch (e) {
      console.error("Error loading bookings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, st: BookingRecord["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: st } : b))
    );

    try {
      const supabase = createClient();
      let dbStatus = "new";
      if (st === "confirmed") dbStatus = "contacted";
      else if (st === "completed") dbStatus = "closed";

      await supabase.from("enquiries").update({ status: dbStatus }).eq("id", id);
    } catch (e) {
      console.warn("Failed to update booking status:", e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the booking request for "${name}"?`)) return;

    try {
      const supabase = createClient();
      await supabase.from("enquiries").delete().eq("id", id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Scheduled Service Bookings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review customer service visits, urgency levels, and confirm time slots.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-orange-strong" : "text-slate-400"} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-orange-strong" />
            <span className="text-sm">Loading service bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-[#071522]">No service bookings</h3>
            <p className="text-xs text-slate-500 mt-1">
              Customer service bookings submitted through the booking form will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Customer &amp; Site</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Requested Timing</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-strong">{b.id.slice(0, 8)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#071522]">{b.name}</div>
                      <div className="text-[11px] text-slate-500">{b.address}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{b.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#071522] block">{b.service}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{b.description}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          b.urgency === "urgent"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : b.urgency === "normal"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {b.urgency === "urgent" && <AlertTriangle size={10} />}
                        {b.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{b.preferredDate}</div>
                      <div className="text-[11px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {b.preferredTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          b.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : b.status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : b.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${b.phone.replace(/\s+/g, "")}`}
                          className="p-2 rounded-lg bg-orange-50 text-orange-strong hover:bg-orange-strong hover:text-white transition-colors border border-orange-200"
                          title="Call Customer"
                        >
                          <Phone size={14} />
                        </a>
                        <a
                          href={`mailto:${b.email}`}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#071522] transition-colors border border-slate-200"
                          title="Email Customer"
                        >
                          <Mail size={14} />
                        </a>
                        <button
                          onClick={() => handleDelete(b.id, b.name)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                          title="Delete booking request"
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
