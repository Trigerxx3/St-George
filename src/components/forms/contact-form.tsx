"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      errs.phone = "Valid phone number is required";
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 2) {
      errs.subject = "Subject is required";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setErrors({ form: data.message || "Failed to send message. Please call us directly." });
      }
    } catch {
      setErrors({ form: "Network error. Please call Justin directly on " + BUSINESS.phoneDisplay });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg">
        <div className="w-14 h-14 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3
          className="text-2xl text-navy mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Message Sent!
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Thank you for reaching out. Justin George will review your message and reply as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "", honeypot: "" });
          }}
          className="text-sm font-semibold text-green hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-lg space-y-4">
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {errors.form}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-navy mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => update("name", e.target.value)}
          className={`input-field ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className={`input-field ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Inverter Error Check / New Office Lighting"
          value={formData.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={`input-field ${errors.subject ? "border-red-500" : ""}`}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-navy mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Please describe how we can assist you..."
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className={`input-field ${errors.message ? "border-red-500" : ""}`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full !py-3.5 text-base shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending Message...
          </>
        ) : (
          <>
            Send Message <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
