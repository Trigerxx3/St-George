import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms and Conditions | St George Electrical Energy Solutions",
  description: "Terms and conditions for services provided by St George Electrical Energy Solutions.",
};

export default function TermsPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom max-w-4xl bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed">
        <h1
          className="text-3xl sm:text-4xl text-navy font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Terms and Conditions
        </h1>
        <p className="text-xs text-gray-400">Last updated: January 2025</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">1. Quotations and Contracts</h2>
          <p>
            All quotations provided by {BUSINESS.name} are valid for 30 days unless otherwise specified. A binding contract is formed upon the customer accepting a formal written quotation and paying any required initial deposit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">2. Electrical Work and Compliance</h2>
          <p>
            All electrical contracting work is performed by licensed electrical personnel under ACT Electrical Contractor Licence #{BUSINESS.licence}. Work complies strictly with AS/NZS 3000 (Wiring Rules), AS/NZS 5033 (Solar PV), and relevant ACT Electricity Safety legislation. Notifiable works are inspected and certified with Access Canberra.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">3. Site Access &amp; Safety</h2>
          <p>
            The customer agrees to ensure safe, unobstructed access to the switchboard, roof areas, and electrical circuits on the scheduled installation date. Any known site hazards (such as structural deterioration or friable asbestos) must be disclosed prior to commencement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">4. Payments and Retention of Title</h2>
          <p>
            Payment terms are specified on each invoice. Equipment supplied (including solar panels, batteries, inverters, and switchgear) remains the legal property of {BUSINESS.name} until all invoices associated with the contract are paid in full.
          </p>
        </section>
      </div>
    </div>
  );
}
