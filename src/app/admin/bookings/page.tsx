"use client";

import { useState } from "react";
import { Calendar, Phone, Mail, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

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

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "BK-104928",
    name: "Robert Evans",
    phone: "0456 789 012",
    email: "revans@example.com",
    service: "Fault Finding & Urgent Electrical Repair",
    urgency: "urgent",
    preferredDate: "2026-10-24",
    preferredTime: "morning",
    address: "14 Dryandra St, O'Connor ACT 2602",
    status: "pending",
    description: "Main safety switch tripping intermittently whenever kitchen appliances run.",
  },
  {
    id: "BK-104915",
    name: "Jessica White",
    phone: "0467 890 123",
    email: "j.white@example.com",
    service: "Smoke Alarm Compliance & Safety Audit",
    urgency: "normal",
    preferredDate: "2026-10-26",
    preferredTime: "afternoon",
    address: "28 Anthony Rolfe Ave, Gungahlin ACT 2912",
    status: "confirmed",
    description: "Annual inspection and certification for rental property tenancy compliance.",
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  const updateStatus = (id: string, st: BookingRecord["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: st } : b))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-strong">{b.id}</td>
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
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        b.urgency === "urgent"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : b.urgency === "normal"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {b.urgency === "urgent" && <AlertTriangle size={11} />}
                      {b.urgency.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#071522]">{b.preferredDate}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{b.preferredTime}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as any)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-strong cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`tel:${b.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-strong font-bold hover:bg-orange-strong hover:text-white transition-colors border border-orange-200"
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
