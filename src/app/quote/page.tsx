import { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import MultiStepQuoteForm from "@/components/forms/multi-step-quote-form";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request a Free Quote | St George Electrical Energy Solutions",
  description:
    "Get an honest, obligation-free quote for solar, battery storage, EV charger installation, or electrical services in Canberra & ACT. Fast response from licensed electrician Justin George.",
};

export default function QuotePage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            ACT Licence #{BUSINESS.licence} · 100% Free &amp; Obligation-Free
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Request a Free Quote
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete this quick 60-second form to receive a tailored assessment for your Canberra property.
          </p>
        </div>

        {/* Suspense-wrapped Multi-Step Quote Wizard */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-3xl mx-auto shadow-sm">
              <div className="w-8 h-8 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Loading quote wizard...</p>
            </div>
          }
        >
          <MultiStepQuoteForm />
        </Suspense>
      </div>
    </div>
  );
}
