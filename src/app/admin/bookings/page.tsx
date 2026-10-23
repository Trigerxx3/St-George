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
          className="text-3xl font-bold text-navy"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Scheduled Service Bookings
        </h1>
        <p className="text-gray-500 text-sm">
          Review customer service visits, urgency levels, and confirm time slots.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer &amp; Site</th>
                <th className="p-4">Service</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Requested Timing</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80">
                  <td className="p-4 font-mono font-bold text-navy">{b.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-navy">{b.name}</div>
                    <div className="text-[11px] text-gray-500">{b.address}</div>
                    <div className="text-[11px] text-gray-400">{b.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-navy block">{b.service}</span>
                    <span className="text-[11px] text-gray-500 line-clamp-1">{b.description}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.urgency === "urgent"
                          ? "bg-red-50 text-red-600"
                          : b.urgency === "normal"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {b.urgency === "urgent" && <AlertTriangle size={11} />}
                      {b.urgency.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-navy">{b.preferredDate}</div>
                    <div className="text-[11px] text-gray-400 capitalize">{b.preferredTime}</div>
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as any)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-gray-200 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={`tel:${b.phone.replace(/\s+/g, "")}`}
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
