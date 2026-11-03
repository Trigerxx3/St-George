import { Suspense } from "react";
import type { Metadata } from "next";
import MultiStepQuoteForm from "@/components/forms/multi-step-quote-form";
import { BUSINESS } from "@/lib/constants";
import WireLine from "@/components/ui/wire-line";

export const metadata: Metadata = {
  title: "Request a Free Quote | St George Electrical Energy Solutions",
  description:
    "Get an honest, obligation-free quote for solar, battery storage, EV charger installation, heating & cooling, security, or electrical services in Canberra & ACT.",
};

export default function QuotePage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-navy-950 pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Background Image + Dark Navy Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero/hero-solar-home.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071522]/90 via-[#071522]/85 to-[#071522]/95" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(650px 380px at 50% 12%, rgba(232, 117, 26, 0.20), transparent 70%)",
          }}
        />
      </div>

      <WireLine className="left-0 right-0 bottom-0 w-full h-36 opacity-60 z-0" variant="sweep" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center mb-4">
            ACT Licence #{BUSINESS.licence} · 100% Free &amp; Obligation-Free
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
            Request a Free <span className="text-accent">Quote</span>
          </h1>
          <p className="text-[#c3d0df] text-sm sm:text-base leading-relaxed">
            Follow the quick step-by-step guide below to receive a tailored assessment for your Canberra property.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-3xl mx-auto shadow-2xl">
              <div className="w-8 h-8 border-4 border-orange-strong border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Loading step-by-step quote wizard...</p>
            </div>
          }
        >
          <MultiStepQuoteForm />
        </Suspense>
      </div>
    </section>
  );
}
