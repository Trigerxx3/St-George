"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sun,
  BatteryCharging,
  Wrench,
  Wind,
  Shield,
  HelpCircle,
  Home,
  Building2,
  Factory,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface FormData {
  serviceType: string;
  propertyType: string;
  suburb: string;
  postcode: string;
  billAmount: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

const SERVICE_OPTIONS = [
  {
    id: "solar-battery",
    badge: "Division 01",
    title: "Solar & Battery",
    desc: "Solar panels, battery storage & hybrid inverters",
    icon: Sun,
  },
  {
    id: "ev-chargers",
    badge: "Division 02",
    title: "EV Chargers",
    desc: "Home & commercial fast charging stations",
    icon: BatteryCharging,
  },
  {
    id: "electrical",
    badge: "Division 03",
    title: "Electrical Services",
    desc: "Switchboards, LED lighting, rewiring & repairs",
    icon: Wrench,
  },
  {
    id: "heating-cooling",
    badge: "Division 04",
    title: "Heating & Cooling",
    desc: "Split system, ducted aircon & climate control",
    icon: Wind,
  },
  {
    id: "security-cctv",
    badge: "Division 05",
    title: "Security & CCTV",
    desc: "CCTV cameras, IP surveillance & remote monitoring",
    icon: Shield,
  },
  {
    id: "other",
    badge: "Custom",
    title: "Multiple / Other Work",
    desc: "Combine multiple divisions or custom project",
    icon: HelpCircle,
  },
];

const PROPERTY_OPTIONS = [
  { id: "house", title: "Residential House", desc: "Standalone single or two-storey home", icon: Home },
  { id: "townhouse", title: "Townhouse / Unit", desc: "Strata or multi-unit residential", icon: Home },
  { id: "commercial", title: "Commercial / Office", desc: "Retail, office, or hospitality site", icon: Building2 },
  { id: "industrial", title: "Industrial / Warehouse", desc: "Workshop, factory, or depot", icon: Factory },
];

const STEPS = [
  { num: 1, label: "Select Service" },
  { num: 2, label: "Property Info" },
  { num: 3, label: "Your Details" },
  { num: 4, label: "Review & Send" },
];

export default function MultiStepQuoteForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    serviceType: "solar-battery",
    propertyType: "house",
    suburb: "Canberra",
    postcode: "2600",
    billAmount: "$500 - $800 / qtr",
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
  const [isArmedForSend, setIsArmedForSend] = useState(false);

  // When transitioning to step 4, delay arming so any double-click or touch-through from Step 3 cannot trigger Send
  useEffect(() => {
    if (step === 4) {
      setIsArmedForSend(false);
      const timer = setTimeout(() => {
        setIsArmedForSend(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsArmedForSend(false);
    }
  }, [step]);

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const suburbParam = searchParams.get("suburb");
    const billParam = searchParams.get("bill");
    const productParam = searchParams.get("product");
    const packageParam = searchParams.get("package");

    if (
      serviceParam &&
      ["solar-battery", "ev-chargers", "electrical", "heating-cooling", "security-cctv", "other"].includes(serviceParam)
    ) {
      setFormData((prev) => ({ ...prev, serviceType: serviceParam }));
    }
    if (suburbParam) {
      setFormData((prev) => ({ ...prev, suburb: suburbParam }));
    }
    if (billParam) {
      setFormData((prev) => ({ ...prev, billAmount: billParam }));
    }
    if (productParam || packageParam) {
      const refText = packageParam
        ? `Interested in package: ${packageParam.replace(/-/g, " ")}`
        : `Interested in product: ${productParam?.replace(/-/g, " ")}`;
      setFormData((prev) => ({
        ...prev,
        message: prev.message ? prev.message : refText,
      }));
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
      if (!formData.serviceType) newErrors.serviceType = "Please choose a service";
    } else if (currentStep === 2) {
      if (!formData.propertyType) newErrors.propertyType = "Please select your property type";
      if (!formData.suburb.trim() || formData.suburb.trim().length < 2) {
        newErrors.suburb = "Please enter your suburb";
      }
      if (!/^[0-9]{4}$/.test(formData.postcode.trim())) {
        newErrors.postcode = "Enter a valid 4-digit postcode (e.g. 2600)";
      }
    } else if (currentStep === 3) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = "Full name is required";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 8) {
        newErrors.phone = "Please enter a valid contact phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  // On Enter in text inputs, only advance to the next step—never submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
      if (step < 4) {
        handleNext();
      }
    }
  };

  // Only ever called via manual, intentional click on the "Send Quote" button on Step 4
  const handleSendQuote = async () => {
    // Under no circumstances send unless the user is on Step 4 and armed
    if (step !== 4) return;
    if (!isArmedForSend) return;

    // Validate that required fields in steps 1, 2, and 3 are present
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setErrors({ form: "Please review previous steps to ensure required contact details are provided." });
      return;
    }

    if (formData.honeypot) {
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
        setErrors({ form: data.message || "Failed to submit quote request. Please call us directly." });
      }
    } catch {
      setErrors({ form: "Network error. Please call us directly on " + BUSINESS.phoneDisplay });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj =
    SERVICE_OPTIONS.find((s) => s.id === formData.serviceType) || SERVICE_OPTIONS[0];
  const selectedPropertyObj =
    PROPERTY_OPTIONS.find((p) => p.id === formData.propertyType) || PROPERTY_OPTIONS[0];

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto text-center animate-fade-in">
        <div className="w-16 h-16 bg-orange/10 text-orange-strong rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-3xl sm:text-4xl text-ink mb-3">
          Quote Request Received!
        </h2>
        <p className="text-body-muted text-base sm:text-lg mb-6 leading-relaxed">
          Thank you, <strong className="text-ink">{formData.name}</strong>. Your reference number is{" "}
          <strong className="text-orange-strong font-mono">{submissionId}</strong>.
        </p>
        <div className="bg-off-white rounded-xl p-5 mb-8 text-left text-sm text-gray-700 space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Selected Service:</span>
            <span className="font-semibold text-ink">{selectedServiceObj.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Property &amp; Location:</span>
            <span className="font-semibold text-ink">
              {selectedPropertyObj.title} · {formData.suburb} {formData.postcode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Direct Contact:</span>
            <span className="font-semibold text-ink">
              {BUSINESS.shortName} ({BUSINESS.phoneDisplay})
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Our team will review your project details and contact you promptly with an obligation-free quote.
        </p>
        <a href={phoneHref(BUSINESS.phone)} className="btn-primary !py-3.5 !px-7">
          <Phone size={18} />
          Need Immediate Assistance? Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {/* Dark Navy Step Progress Header */}
      <div className="section-dark p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <span className="eyebrow mb-1">Step {step} of 4</span>
            <h2 className="text-xl sm:text-2xl text-white">
              {STEPS[step - 1].label}
            </h2>
          </div>
          <a
            href={phoneHref(BUSINESS.phone)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-light hover:text-white transition-colors"
          >
            <Phone size={15} /> Prefer to talk? Call {BUSINESS.phoneDisplay}
          </a>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {STEPS.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                disabled={s.num > step}
                className={`text-left group transition-all ${
                  s.num < step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`h-1.5 rounded-full mb-2 transition-all ${
                    isCurrent
                      ? "bg-orange"
                      : isCompleted
                      ? "bg-orange/60 group-hover:bg-orange"
                      : "bg-white/15"
                  }`}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 transition-colors ${
                      isCurrent
                        ? "bg-orange text-white"
                        : isCompleted
                        ? "bg-orange/25 text-orange-light"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {isCompleted ? "✓" : s.num}
                  </span>
                  <span
                    className={`text-xs font-semibold truncate hidden sm:inline ${
                      isCurrent
                        ? "text-white"
                        : isCompleted
                        ? "text-[#c3d0df]"
                        : "text-white/40"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div onKeyDown={handleKeyDown} className="p-6 sm:p-10">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            value={formData.honeypot}
            onChange={(e) => updateField("honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {errors.form && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <AlertCircle size={18} /> {errors.form}
          </div>
        )}

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl text-ink mb-1">
                Which service do you need a quote for?
              </h3>
              <p className="text-xs sm:text-sm text-body-muted">
                Choose one of our 5 divisions below (or select Multiple / Other Work).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SERVICE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.serviceType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField("serviceType", item.id)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? "border-orange-strong bg-orange/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-orange-strong text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-strong block mb-0.5">
                        {item.badge}
                      </span>
                      <h4 className="font-bold text-ink text-base leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PROPERTY & LOCATION */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl text-ink mb-1">
                Tell us about your property
              </h3>
              <p className="text-xs sm:text-sm text-body-muted">
                This helps us check your roof/switchboard requirements and local ACT/NSW compliance.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-ink mb-2.5">
                Property Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROPERTY_OPTIONS.map((prop) => {
                  const Icon = prop.icon;
                  const isSelected = formData.propertyType === prop.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => updateField("propertyType", prop.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "border-orange-strong bg-orange/5 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-orange-strong text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-ink text-sm">{prop.title}</div>
                        <div className="text-xs text-gray-500">{prop.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Suburb <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Belconnen, Gungahlin, Queanbeyan"
                  value={formData.suburb}
                  onChange={(e) => updateField("suburb", e.target.value)}
                  className={`input-field ${errors.suburb ? "border-red-500" : ""}`}
                />
                {errors.suburb && (
                  <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
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
                {errors.postcode && (
                  <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>
                )}
              </div>
            </div>

            {formData.serviceType === "solar-battery" && (
              <div>
                <label className="block text-xs font-semibold text-ink mb-2">
                  Approx. Quarterly Electricity Bill (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    "Under $500 / qtr",
                    "$500 - $800 / qtr",
                    "$800 - $1,200 / qtr",
                    "$1,200+ / qtr",
                  ].map((bill) => (
                    <button
                      key={bill}
                      type="button"
                      onClick={() => updateField("billAmount", bill)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        formData.billAmount === bill
                          ? "border-orange-strong bg-orange-strong text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {bill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CONTACT DETAILS */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-xl text-ink mb-1">Your Contact Details</h3>
              <p className="text-xs sm:text-sm text-body-muted">
                Where should we send your quote or call to discuss your project?
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`input-field ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0400 000 000"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="sarah@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`input-field ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: NOTES & REVIEW */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl text-ink mb-1">
                Additional Notes &amp; Review
              </h3>
              <p className="text-xs sm:text-sm text-body-muted">
                Add any specific details about the work you need, then submit your request.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Project Notes / Specific Requirements (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Tell us briefly about the work needed (e.g. number of rooms for split system aircon, solar + battery size, CCTV camera points, switchboard upgrade)..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="input-field"
              />
            </div>

            {/* Summary Card */}
            <div className="bg-off-white rounded-2xl p-5 border border-gray-200 space-y-2.5 text-xs sm:text-sm">
              <div className="font-bold text-ink uppercase tracking-wider text-xs mb-2">
                Quote Summary
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Service Division:</span>
                <span className="font-semibold text-ink text-right">
                  {selectedServiceObj.badge} — {selectedServiceObj.title}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Property &amp; Suburb:</span>
                <span className="font-semibold text-ink text-right">
                  {selectedPropertyObj.title} · {formData.suburb} {formData.postcode}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Contact:</span>
                <span className="font-semibold text-ink text-right">
                  {formData.name} ({formData.phone})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-outline-dark !py-3 !px-5 text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck size={16} className="text-orange-strong shrink-0" />
              <span>ACT Licence #{BUSINESS.licence} · Free Quote</span>
            </div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary !py-3.5 !px-7 text-sm sm:text-base cursor-pointer ml-auto"
            >
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || !isArmedForSend}
              onClick={handleSendQuote}
              className="btn-primary !py-3.5 !px-8 text-sm sm:text-base shadow-lg disabled:opacity-50 cursor-pointer ml-auto flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending Quote...
                </>
              ) : (
                <>
                  <span>Send Quote</span>
                  <Send size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
