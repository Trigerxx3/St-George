import type { Metadata } from "next";
import { ShieldCheck, Award, CheckCircle2 } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Warranty & Guarantee Policy | St George Electrical Energy Solutions",
  description: "Comprehensive warranty terms, workmanship guarantees, and product coverage from St George Electrical.",
};

export default function WarrantyPage() {
  return (
    <div className="section-light min-h-screen py-14 lg:py-24">
      <div className="container-custom max-w-4xl bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed">
        <span className="eyebrow mb-2">
          Comprehensive Australian Consumer Law Protected
        </span>

        <h1
          className="text-3xl sm:text-4xl text-ink font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Warranty &amp; <span className="text-orange-strong">Workmanship Policy</span>
        </h1>

        <p className="text-gray-600">
          At {BUSINESS.name}, we stand firmly behind the durability and quality of our work. Our installations are supported by three robust layers of warranty protection.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="p-5 rounded-xl bg-off-white border border-gray-200 text-center">
            <span className="text-2xl font-bold text-orange-strong block font-mono">10 Years</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mt-1">Workmanship Guarantee</span>
            <p className="text-xs text-gray-500 mt-2">Direct contractor guarantee covering all electrical wiring and roof mounting labor.</p>
          </div>

          <div className="p-5 rounded-xl bg-off-white border border-gray-200 text-center">
            <span className="text-2xl font-bold text-ink block font-mono">10 – 12 Years</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mt-1">Inverter &amp; Battery</span>
            <p className="text-xs text-gray-500 mt-2">Comprehensive manufacturer warranties covering inverters and lithium storage batteries.</p>
          </div>

          <div className="p-5 rounded-xl bg-off-white border border-gray-200 text-center">
            <span className="text-2xl font-bold text-orange-strong block font-mono">25 – 30 Years</span>
            <span className="text-xs font-bold text-ink uppercase tracking-wider block mt-1">Panel Performance</span>
            <p className="text-xs text-gray-500 mt-2">Tier-1 linear performance output guarantees on all N-Type TOPCon solar panels.</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink">1. Contractor Workmanship Guarantee</h2>
          <p>
            {BUSINESS.name} provides an unconditional 10-year workmanship guarantee on all electrical, solar, and battery storage installations. If any fault arises due to installation labor, cabling, terminations, or roof mounting penetrations, we will inspect and repair the issue promptly at zero cost to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink">2. Australian Consumer Law (ACL) Guarantees</h2>
          <p>
            Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures with the service, you are entitled to cancel your service contract with us and to a refund for the unused portion, or to compensation for its reduced value.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink">3. Warranty Claims Process</h2>
          <p>
            Making a warranty inquiry is simple and direct. You won&apos;t deal with third-party warranty handling centres. Contact {BUSINESS.name} directly on{" "}
            <a href="tel:0450598628" className="text-orange-strong font-semibold">
              0450 598 628
            </a>{" "}
            or email{" "}
            <a href={`mailto:${BUSINESS.email}`} className="text-orange-strong font-semibold">
              {BUSINESS.email}
            </a>
            . We prioritize diagnostic support and rectify issues without unnecessary delays.
          </p>
        </section>
      </div>
    </div>
  );
}
