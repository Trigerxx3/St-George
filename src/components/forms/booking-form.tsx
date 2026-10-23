"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

const SERVICE_TYPES = [
  "Switchboard Upgrade / Safety Switch Tripping",
  "Fault Finding & Urgent Electrical Repair",
  "LED Lighting Installation / Upgrade",
  "Power Points & Dedicated Appliance Circuit",
  "EV Charger Assessment & Installation",
  "Solar System Health Check / Inverter Error",
  "Smoke Alarm Compliance & Safety Audit",
  "Renovation / Rewiring Rough-In",
  "Other Electrical Work",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    serviceType: SERVICE_TYPES[0],
    urgency: "normal",
    preferredDate: "",
    preferredTime: "morning",
    name: "",
    email: "",
    phone: "",
    address: "",
    suburb: "Canberra",
    postcode: "2600",
    description: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const update = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Valid email is required";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errs.phone = "Valid contact phone number is required";
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = "Street address is required";
    }
    if (!formData.suburb.trim()) {
      errs.suburb = "Suburb is required";
    }
    if (!/^[0-9]{4}$/.test(formData.postcode.trim())) {
      errs.postcode = "4-digit postcode required";
    }
    if (!formData.preferredDate) {
      errs.preferredDate = "Please choose a preferred date";
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      errs.description = "Please describe the job or symptoms";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (formData.honeypot) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setBookingRef(data.id || "BK-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setErrors({ form: data.message || "Failed to submit booking request. Please call us." });
      }
    } catch {
      setErrors({ form: "Network error. Please call Justin directly on " + BUSINESS.phoneDisplay });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xl max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h2
          className="text-3xl sm:text-4xl text-navy mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Booking Request Received!
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
          Thanks <strong className="text-navy">{formData.name}</strong>. Your booking inquiry reference is{" "}
          <strong className="text-green font-mono">{bookingRef}</strong>.
        </p>

        <div className="bg-off-white rounded-xl p-5 mb-8 text-left text-sm text-gray-700 space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-semibold text-navy">{formData.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Requested Date & Time:</span>
            <span className="font-semibold text-navy">{formData.preferredDate} ({formData.preferredTime})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Address:</span>
            <span className="font-semibold text-navy">{formData.address}, {formData.suburb}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Justin will check the service vehicle schedule and phone you to confirm your time slot.
        </p>

        <a href={phoneHref(BUSINESS.phone)} className="btn-primary !py-3 !px-6">
          <Phone size={18} />
          Have an Emergency? Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="bg-navy p-6 sm:p-8 text-white">
        <h2
          className="text-2xl sm:text-3xl text-white mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Schedule an Electrician
        </h2>
        <p className="text-white/70 text-sm">
          Book a licensed electrical inspection, repair, or upgrade for your property.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            value={formData.honeypot}
            onChange={(e) => update("honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {errors.form && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {errors.form}
          </div>
        )}

        {/* Urgency selection */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">How urgent is this job?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "urgent", label: "Urgent (Within 24-48h)", icon: AlertTriangle, desc: "Power outage or safety hazard" },
              { id: "normal", label: "Standard (This week)", icon: Calendar, desc: "Scheduled upgrade or repair" },
              { id: "flexible", label: "Flexible", icon: Clock, desc: "Planning ahead / anytime" },
            ].map((u) => {
              const Icon = u.icon;
              const isSelected = formData.urgency === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => update("urgency", u.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-green bg-green/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className={isSelected ? "text-green" : "text-gray-500"} />
                    <span className="text-sm font-bold text-navy">{u.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{u.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Service Required <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) => update("serviceType", e.target.value)}
            className="input-field"
          >
            {SERVICE_TYPES.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              className={`input-field ${errors.preferredDate ? "border-red-500" : ""}`}
            />
            {errors.preferredDate && (
              <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Preferred Time of Day
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
              className="input-field"
            >
              <option value="morning">Morning (7:00 AM – 12:00 PM)</option>
              <option value="afternoon">Afternoon (12:00 PM – 5:00 PM)</option>
              <option value="anytime">Anytime during business hours</option>
            </select>
          </div>
        </div>

        {/* Description of Work */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Describe the work or issue <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. RCD keeps tripping when dishwasher is turned on; Need 4 extra downlights in living room; Switchboard inspection for older home"
            value={formData.description}
            onChange={(e) => update("description", e.target.value)}
            className={`input-field ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Contact & Location Details */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-base font-bold text-navy flex items-center gap-2">
            <Wrench size={18} className="text-green" /> Your Details &amp; Site Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. David Miller"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                className={`input-field ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0400 000 000"
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={`input-field ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="david@example.com"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-navy mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="12 Example St"
                value={formData.address}
                onChange={(e) => update("address", e.target.value)}
                className={`input-field ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Suburb <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Canberra / Suburb"
                value={formData.suburb}
                onChange={(e) => update("suburb", e.target.value)}
                className={`input-field ${errors.suburb ? "border-red-500" : ""}`}
              />
              {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="2600"
                value={formData.postcode}
                onChange={(e) => update("postcode", e.target.value)}
                className={`input-field ${errors.postcode ? "border-red-500" : ""}`}
              />
              {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
            </div>
          </div>
        </div>

        <div className="p-4 bg-off-white rounded-xl border border-gray-200 text-xs text-gray-500 flex items-center gap-3">
          <ShieldCheck size={20} className="text-green flex-shrink-0" />
          <span>
            Fully licensed &amp; insured. Master Electricians member. ACT Licence #{BUSINESS.licence}.
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full !py-3.5 text-base shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting Booking Request...
            </>
          ) : (
            <>Submit Booking Request</>
          )}
        </button>
      </form>
    </div>
  );
}
