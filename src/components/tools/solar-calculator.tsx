"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  BatteryCharging,
  DollarSign,
  TrendingDown,
  Leaf,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export default function SolarCalculator() {
  const [quarterlyBill, setQuarterlyBill] = useState<number>(800);
  const [includeBattery, setIncludeBattery] = useState<boolean>(true);
  const [roofType, setRoofType] = useState<string>("tile");

  // Canberra specific solar calculations (~4.3 to 4.8 peak sun hours, avg retail electricity ~32c/kWh)
  // Annual bill = quarterlyBill * 4
  const annualBill = quarterlyBill * 4;

  // System sizing logic:
  // Under $500/quarter -> 5kW - 6.6kW
  // $500 - $900/quarter -> 6.6kW - 8kW
  // $900 - $1400/quarter -> 10kW
  // $1400+/quarter -> 13.2kW+
  let recommendedSize = 6.6;
  if (quarterlyBill < 500) recommendedSize = 5.0;
  else if (quarterlyBill <= 850) recommendedSize = 6.6;
  else if (quarterlyBill <= 1200) recommendedSize = 10.0;
  else recommendedSize = 13.2;

  // Annual generation in Canberra: ~1450 kWh per kW installed
  const annualGenerationKwh = Math.round(recommendedSize * 1450);

  // Solar self-consumption savings:
  // Without battery: ~40% self-consumed @ 32c/kWh, 60% exported @ 7.5c/kWh
  // With battery: ~80% self-consumed @ 32c/kWh, 20% exported @ 7.5c/kWh
  const selfConsumptionRate = includeBattery ? 0.8 : 0.42;
  const exportRate = 1 - selfConsumptionRate;

  const savingsKwhSelf = annualGenerationKwh * selfConsumptionRate * 0.32;
  const savingsKwhExport = annualGenerationKwh * exportRate * 0.075;
  const rawAnnualSavings = Math.round(savingsKwhSelf + savingsKwhExport);
  // Cap savings to realistic maximum of 85% of total annual bill
  const estimatedAnnualSavings = Math.min(rawAnnualSavings, Math.round(annualBill * (includeBattery ? 0.88 : 0.65)));

  // Estimated payback period
  const estimatedSystemCost = includeBattery
    ? recommendedSize * 950 + 10500 // solar + battery after STC
    : recommendedSize * 950; // solar only after STC
  const paybackYears = (estimatedSystemCost / estimatedAnnualSavings).toFixed(1);

  // Environmental impact: ~0.82 kg CO2 per kWh in grid offset
  const co2AvoidedTonnes = ((annualGenerationKwh * 0.82) / 1000).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-navy p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green/20 text-green-light rounded-full text-xs font-semibold mb-3">
          <Sun size={14} />
          Canberra Climate &amp; Tariff Model
        </div>
        <h2
          className="text-2xl sm:text-3xl text-white mb-2 font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Solar &amp; Battery Savings Calculator
        </h2>
        <p className="text-white/70 text-xs sm:text-sm">
          Calculate how much your Canberra household can save each year by switching to clean rooftop solar.
        </p>
      </div>

      <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quarterly Bill Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-navy">
                Average Quarterly Power Bill
              </label>
              <span className="text-lg font-bold text-green font-mono">
                ${quarterlyBill} / qtr
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={2500}
              step={50}
              value={quarterlyBill}
              onChange={(e) => setQuarterlyBill(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>$300 (Low)</span>
              <span>$1,000 (Avg)</span>
              <span>$2,500+ (High)</span>
            </div>
          </div>

          {/* Include Battery Storage Toggle */}
          <div>
            <label className="text-sm font-bold text-navy block mb-2">
              Add Home Battery Storage?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIncludeBattery(true)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  includeBattery
                    ? "border-green bg-green/5 text-navy shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BatteryCharging
                    size={16}
                    className={includeBattery ? "text-green" : "text-gray-400"}
                  />
                  <span className="text-xs font-bold">Yes (Recommended)</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Store surplus daytime solar for evening peak use.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIncludeBattery(false)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  !includeBattery
                    ? "border-green bg-green/5 text-navy shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sun size={16} className={!includeBattery ? "text-green" : "text-gray-400"} />
                  <span className="text-xs font-bold">Solar Only</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Battery-ready system with future upgrade path.
                </p>
              </button>
            </div>
          </div>

          {/* Roof Type Selection */}
          <div>
            <label className="text-sm font-bold text-navy block mb-2">
              Roof Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "tile", label: "Concrete Tile" },
                { id: "tin", label: "Colorbond / Tin" },
                { id: "terracotta", label: "Terracotta" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoofType(r.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    roofType === r.id
                      ? "border-green bg-green/10 text-green font-bold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-off-white rounded-xl border border-gray-100 text-xs text-gray-500 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-green flex-shrink-0 mt-0.5" />
            <span>
              Eligible for up to $15,000 zero-interest finance under the ACT Sustainable Household Scheme.
            </span>
          </div>
        </div>

        {/* Right: Calculated Results Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-light block mb-1">
              Estimated Annual Savings
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              ${estimatedAnnualSavings.toLocaleString()}
              <span className="text-lg text-white/60 font-normal"> / year</span>
            </div>
            <p className="text-xs text-white/70 mb-6">
              Approx. ${(estimatedAnnualSavings * 10).toLocaleString()} saved over 10 years of solar generation.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Recommended Size</span>
                <span className="text-lg font-bold text-white font-mono">
                  {recommendedSize} kW
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  ~{annualGenerationKwh.toLocaleString()} kWh/yr
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Payback Period</span>
                <span className="text-lg font-bold text-green-light font-mono">
                  ~{paybackYears} Years
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  Full ROI in warranty
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Carbon Offset</span>
                <span className="text-lg font-bold text-white font-mono">
                  {co2AvoidedTonnes} Tonnes
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  CO₂ avoided / year
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Battery Storage</span>
                <span className="text-lg font-bold text-white font-mono">
                  {includeBattery ? "Included" : "Solar Only"}
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  {includeBattery ? "13.5kWh Backup" : "Battery-Ready"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              href={`/quote?service=solar-battery&bill=$${quarterlyBill}&systemSize=${recommendedSize}kW`}
              className="btn-primary w-full !py-3.5 text-center justify-center flex text-sm"
            >
              Request Exact Site Quote <ArrowRight size={16} />
            </Link>
            <p className="text-[11px] text-center text-white/50">
              *Estimates based on average Canberra irradiation and standard ACT retail tariffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
