import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | St George Electrical Energy Solutions",
  description: "Privacy Policy for St George Electrical Energy Solutions.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom max-w-4xl bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed">
        <h1
          className="text-3xl sm:text-4xl text-navy font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400">Last updated: January 2025</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">1. Introduction</h2>
          <p>
            {BUSINESS.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy in accordance with the Australian Privacy Principles (APPs) established under the Privacy Act 1988 (Cth). This policy outlines how we collect, handle, and safeguard your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">2. Information We Collect</h2>
          <p>We may collect personal details necessary to provide our electrical and solar contracting services, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Your full name and contact information (email address, telephone number).</li>
            <li>Site address and property details required for quotations and site visits.</li>
            <li>Electricity bills, meter numbers (NMI), and usage data for solar sizing.</li>
            <li>Information submitted via our online quote and booking request forms.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">3. How We Use Your Information</h2>
          <p>Your information is used solely for legitimate business purposes, including:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Preparing and delivering tailored quotes for solar, battery, EV, or electrical work.</li>
            <li>Scheduling site inspections, repairs, and installations.</li>
            <li>Lodging network connection applications with EvoEnergy or relevant distributors.</li>
            <li>Submitting compliance certificates to Access Canberra.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">4. Disclosure to Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal information. We only share details with authorized entities when strictly required to complete your installation (e.g. EvoEnergy for network approvals, Clean Energy Regulator for STC rebate creation, or Access Canberra for electrical compliance).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-navy">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to access or update your information, please contact Justin George at{" "}
            <a href={`mailto:${BUSINESS.email}`} className="text-green font-semibold underline">
              {BUSINESS.email}
            </a>{" "}
            or call {BUSINESS.phoneDisplay}.
          </p>
        </section>
      </div>
    </div>
  );
}
