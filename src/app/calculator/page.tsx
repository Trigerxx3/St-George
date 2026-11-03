import type { Metadata } from "next";
import SolarCalculator from "@/components/tools/solar-calculator";
import { ShieldCheck, Zap, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Solar & Battery Savings Calculator Canberra | St George Electrical",
  description:
    "Calculate your rooftop solar potential, estimated annual power bill savings, payback period, and CO2 offset in Canberra and ACT. Instant online calculation.",
};

export default function CalculatorPage() {
  return (
    <div className="section-light min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="eyebrow mb-3 !text-orange-strong">
            Instant Canberra Solar Yield &amp; Bill Estimator
          </span>
          <h1 className="text-3xl sm:text-5xl text-ink mb-4">
            Calculate Your <span className="text-accent">Solar Savings</span>
          </h1>
          <p className="text-body-muted text-sm sm:text-base max-w-xl mx-auto">
            Find out how much you can save each year and how quickly a clean solar and battery system pays for itself in the ACT.
          </p>
        </div>

        <SolarCalculator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-center">
          <div className="card p-6">
            <div className="w-11 h-11 rounded-xl border border-orange-strong/25 text-orange-strong flex items-center justify-center mx-auto mb-3">
              <Award size={20} />
            </div>
            <h3 className="font-bold text-ink text-sm mb-1">ACT Scheme Eligible</h3>
            <p className="text-xs text-body-muted">
              Access up to $15,000 in interest-free loans over 10 years via the ACT Government Sustainable Household Scheme.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-11 h-11 rounded-xl border border-orange-strong/25 text-orange-strong flex items-center justify-center mx-auto mb-3">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-ink text-sm mb-1">Federal STC Rebate</h3>
            <p className="text-xs text-body-muted">
              Receive up to $2,500 – $4,000 in upfront point-of-sale discounts applied directly to your proposal.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-11 h-11 rounded-xl border border-orange-strong/25 text-orange-strong flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-ink text-sm mb-1">25-Year Protection</h3>
            <p className="text-xs text-body-muted">
              Tier-1 N-Type TOPCon panels backed by 25-year manufacturer warranties and our 10-year workmanship guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
