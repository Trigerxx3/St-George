import type { Metadata } from "next";
import EVChargerSelector from "@/components/tools/ev-charger-selector";
import { BatteryCharging, ShieldCheck, CheckCircle2, Zap } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "EV Charger Selector Tool Canberra | St George Electrical",
  description:
    "Find the ideal home or commercial electric vehicle charger for your Tesla, BYD, Hyundai, MG, or Polestar in Canberra. Calculate charging speed and fuel savings.",
};

export default function EVSelectorPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <BatteryCharging size={14} />
            ACT Licensed Electric Vehicle Charging Specialist
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Find Your Ideal EV Charger
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Choose your electric car to calculate charging speeds, overnight replenishment times, and see solar-smart charging options.
          </p>
        </div>

        <EVChargerSelector />

        {/* Supporting trust points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-center">
          <div className="card p-6 bg-white border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-green/10 text-green flex items-center justify-center mx-auto mb-3">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-navy text-sm mb-1">Fast Level 2 Charging</h3>
            <p className="text-xs text-gray-500">
              Charge up to 8x faster than a standard 10A wall plug. Dedicated 32A wiring with Type B safety protection.
            </p>
          </div>

          <div className="card p-6 bg-white border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-navy text-sm mb-1">EvoEnergy &amp; ACT Compliant</h3>
            <p className="text-xs text-gray-500">
              Every installation is inspected, tested, and issued with an official ACT Certificate of Electrical Compliance.
            </p>
          </div>

          <div className="card p-6 bg-white border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold text-navy text-sm mb-1">All Makes &amp; Models</h3>
            <p className="text-xs text-gray-500">
              Certified for Tesla Wall Connector, Myenergi Zappi, Ocular, Wallbox, Delta, and Schneider charging hardware.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
