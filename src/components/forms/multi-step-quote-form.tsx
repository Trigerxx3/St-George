"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sun,
  BatteryCharging,
  Wrench,
  HelpCircle,
  Home,
  Building,
  Building2,
  Factory,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface FormData {
  serviceType: string;
  propertyType: string;
  suburb: string;
  postcode: string;
  billAmount: string;
  systemSize: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

const SERVICE_OPTIONS = [
  {
    id: "solar-battery",
    title: "Solar & Battery Storage",
    desc: "Cut electricity bills with rooftop solar and home batteries",
    icon: Sun,
  },
  {
    id: "ev-chargers",
    title: "EV Charger Installation",
    desc: "Fast home or commercial EV wall chargers",
    icon: BatteryCharging,
  },
  {
    id: "electrical",
    title: "General Electrical",
    desc: "Switchboard upgrades, lighting, rewiring & repairs",
    icon: Wrench,
  },
  {
    id: "other",
    title: "Combined / Custom Project",
    desc: "Multi-service package or specialized electrical inquiry",
    icon: HelpCircle,
  },
];

const PROPERTY_OPTIONS = [
  { id: "house", label: "Single House", icon: Home },
  { id: "townhouse", label: "Townhouse", icon: Building },
  { id: "unit", label: "Unit / Apartment", icon: Building },
  { id: "commercial", label: "Commercial Office / Retail", icon: Building2 },
  { id: "industrial", label: "Industrial / Warehouse", icon: Factory },
];

const BILL_OPTIONS = [
  { id: "under-500", label: "Under $500 / quarter" },
  { id: "500-1000", label: "$500 – $1,000 / quarter" },
  { id: "1000-1500", label: "$1,000 – $1,500 / quarter" },
  { id: "1500-plus", label: "$1,500+ / quarter" },
  { id: "unsure", label: "Not sure / New Build" },
];

export default function MultiStepQuoteForm() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    serviceType: "solar-battery",
    propertyType: "house",
    suburb: "Canberra",
    postcode: "2600",
    billAmount: "$500 – $1,000 / quarter",
    systemSize: "Standard 6.6kW – 10kW",
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  // Sync with URL parameters if provided
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const propertyParam = searchParams.get("property");
    if (serviceParam && ["solar-battery", "ev-chargers", "electrical", "other"].includes(serviceParam)) {
      setFormData((prev) => ({ ...prev, serviceType: serviceParam }));
    }
    if (propertyParam && ["house", "townhouse", "unit", "commercial", "industrial"].includes(propertyParam)) {
      setFormData((prev) => ({ ...prev, propertyType: propertyParam }));
    }
  }, [searchParams]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.serviceType) newErrors.serviceType = "Please select a service";
    }

    if (currentStep === 2) {
      if (!formData.propertyType) newErrors.propertyType = "Please select a property type";
      if (!formData.suburb.trim()) newErrors.suburb = "Please enter your suburb";
      if (!/^[0-9]{4}$/.test(formData.postcode.trim())) {
        newErrors.postcode = "Please enter a valid 4-digit postcode";
      }
    }

    if (currentStep === 4) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = "Please enter your full name";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 8) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // Check honeypot
    if (formData.honeypot) {
      // Silently discard spam
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setSubmissionId(data.id || "STG-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setErrors({ form: data.message || "Failed to submit quote request. Please try calling us directly." });
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
          Quote Request Received!
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
          Thank you, <strong className="text-navy">{formData.name}</strong>. Your request reference is{" "}
          <strong className="text-green font-mono">{submissionId}</strong>.
        </p>
        <div className="bg-off-white rounded-xl p-5 mb-8 text-left text-sm text-gray-700 space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-semibold text-navy capitalize">{formData.serviceType.replace("-", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="font-semibold text-navy">{formData.suburb}, {formData.postcode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Direct Contact:</span>
            <span className="font-semibold text-navy">Justin George (0450 598 628)</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Justin George will review your site details and contact you within 24 business hours with an honest, tailored proposal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={phoneHref(BUSINESS.phone)}
            className="btn-primary !py-3 !px-6"
          >
            <Phone size={18} />
            Need Immediate Assistance? Call Now
          </a>
        </div>
      </div>
    );
  }

  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Progress Bar Header */}
      <div className="bg-navy p-6 sm:p-8 text-white relative">
        <div className="flex items-center justify-between text-xs sm:text-sm text-white/70 mb-2 font-medium">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-green-light font-semibold">
            {step === 1 && "Choose Service"}
            {step === 2 && "Property & Location"}
            {step === 3 && "Usage & System"}
            {step === 4 && "Contact Details"}
          </span>
        </div>
        {/* Progress bar track */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-green transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10">
        {/* Honeypot field (hidden from real users) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_field">Do not fill this</label>
          <input
            id="hp_field"
            type="text"
            value={formData.honeypot}
            onChange={(e) => updateField("honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* STEP 1: SERVICE TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3
                className="text-2xl sm:text-3xl text-navy mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What service are you looking for?
              </h3>
              <p className="text-gray-500 text-sm">
                Select the primary solution you need. You can always discuss additional work with us.
              </p>
            </div>

            {errors.serviceType && (
              <p className="text-red-500 text-xs flex items-center gap-1.5">
                <AlertCircle size={14} /> {errors.serviceType}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.serviceType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField("serviceType", item.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-green bg-green/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-green text-white" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-green bg-green" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-base mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PROPERTY & LOCATION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3
                className="text-2xl sm:text-3xl text-navy mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Tell us about your property
              </h3>
              <p className="text-gray-500 text-sm">
                This helps us estimate roof space, electrical capacity, and travel radius.
              </p>
            </div>

            {/* Property type selection */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2.5">Property Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.propertyType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateField("propertyType", opt.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? "border-green bg-green/5 font-semibold text-green shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} className={isSelected ? "text-green" : "text-gray-500"} />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Suburb <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Belconnen, Kingston, Queanbeyan"
                  value={formData.suburb}
                  onChange={(e) => updateField("suburb", e.target.value)}
                  className={`input-field ${errors.suburb ? "border-red-500" : ""}`}
                />
                {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 2600"
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  className={`input-field ${errors.postcode ? "border-red-500" : ""}`}
                />
                {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: USAGE & SYSTEM SIZE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3
                className="text-2xl sm:text-3xl text-navy mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Energy usage &amp; preferences
              </h3>
              <p className="text-gray-500 text-sm">
                Helps us size the optimum solar system or evaluate your electrical capacity.
              </p>
            </div>

            {/* Quarterly bill */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-2.5">
                Approximate Quarterly Power Bill
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BILL_OPTIONS.map((bill) => {
                  const isSelected = formData.billAmount === bill.label;
                  return (
                    <button
                      key={bill.id}
                      type="button"
                      onClick={() => updateField("billAmount", bill.label)}
                      className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-green bg-green/5 text-navy font-semibold shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span>{bill.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-green bg-green" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Any specific requests */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Any specific system preferences or questions? (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Interested in Tesla Powerwall or Sungrow battery; Have a 3-phase connection; Need EV charger on detached garage"
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT INFORMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3
                className="text-2xl sm:text-3xl text-navy mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Where should we send your quote?
              </h3>
            </div>

            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={16} /> {errors.form}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`input-field ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`input-field ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0400 000 000"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-gray-200 text-xs text-gray-500 flex items-center gap-3">
              <ShieldCheck size={20} className="text-green flex-shrink-0" />
              <span>
                Your privacy is protected. We will never share or sell your details. ACT Licence #{BUSINESS.licence}.
              </span>
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary !py-3 !px-6 text-sm"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !py-3.5 !px-8 text-base shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Quote Request <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
