"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Zap,
  Sun,
  ShieldCheck,
  ArrowRight,
  Car,
  Clock,
  Sparkles,
} from "lucide-react";

interface EVModel {
  name: string;
  batteryKwh: number;
  maxAcKw: number;
  efficiencyKmKwh: number; // km per kWh
}

const EV_MODELS: Record<string, EVModel> = {
  "tesla-3-y": { name: "Tesla Model 3 / Model Y", batteryKwh: 60, maxAcKw: 11, efficiencyKmKwh: 6.5 },
  "byd-atto-seal": { name: "BYD Atto 3 / Seal / Dolphin", batteryKwh: 60, maxAcKw: 7.4, efficiencyKmKwh: 6.2 },
  "hyundai-kia": { name: "Hyundai Ioniq 5/6 / Kia EV6", batteryKwh: 77.4, maxAcKw: 11, efficiencyKmKwh: 5.8 },
  "mg-4": { name: "MG4 / MG ZS EV", batteryKwh: 51, maxAcKw: 7.0, efficiencyKmKwh: 6.3 },
  "polestar-volvo": { name: "Polestar 2 / Volvo EX30", batteryKwh: 69, maxAcKw: 11, efficiencyKmKwh: 5.9 },
  other: { name: "Other Electric Vehicle", batteryKwh: 65, maxAcKw: 11, efficiencyKmKwh: 6.0 },
};

export default function EVChargerSelector() {
  const [selectedEv, setSelectedEv] = useState<string>("tesla-3-y");
  const [powerPhase, setPowerPhase] = useState<"single" | "three" | "unsure">("single");
  const [dailyCommuteKm, setDailyCommuteKm] = useState<number>(45);
  const [hasSolar, setHasSolar] = useState<boolean>(true);

  const vehicle = EV_MODELS[selectedEv] || EV_MODELS.other;

  // Max charge speed limited by either vehicle onboard charger or property electrical phase
  // Single phase: 7.4 kW (32A)
  // Three phase: min(vehicle.maxAcKw, 22 kW) -> typically 11kW for most EVs
  const chargingSpeedKw = powerPhase === "three" ? Math.min(vehicle.maxAcKw, 11) : 7.4;

  // Range added per hour: chargingSpeedKw * vehicle.efficiencyKmKwh
  const rangePerHourKm = Math.round(chargingSpeedKw * vehicle.efficiencyKmKwh);

  // Time to replenish daily commute
  const dailyChargeMinutes = Math.round((dailyCommuteKm / rangePerHourKm) * 60);

  // Time to full 0-100% charge
  const fullChargeHours = (vehicle.batteryKwh / chargingSpeedKw).toFixed(1);

  // Annual petrol vs EV fuel savings:
  // Avg petrol car @ 9L/100km @ $1.95/L = ~$17.55 per 100km
  // EV charging cost:
  // With solar: ~3c/kWh effective cost -> ~$0.50 per 100km
  // Off-peak grid: ~18c/kWh -> ~$2.90 per 100km
  const annualKm = dailyCommuteKm * 365;
  const petrolAnnualCost = (annualKm / 100) * 9 * 1.95;
  const evAnnualCost = hasSolar ? (annualKm / 100) * (100 / vehicle.efficiencyKmKwh) * 0.05 : (annualKm / 100) * (100 / vehicle.efficiencyKmKwh) * 0.20;
  const annualSavings = Math.round(petrolAnnualCost - evAnnualCost);

  // Recommendation logic:
  let recommendedCharger = "Tesla Wall Connector Gen 3";
  let chargerReason = "Universal Type 2, sleek aesthetics, 22kW three-phase capable and Wi-Fi app.";
  if (hasSolar) {
    recommendedCharger = "Myenergi Zappi V2.1 (Solar-Smart)";
    chargerReason = "Integrates with your rooftop solar to charge 100% on free surplus clean power.";
  } else if (selectedEv !== "tesla-3-y") {
    recommendedCharger = "Ocular LTE Plus Universal";
    chargerReason = "Reliable, high-speed Australian-certified charging with robust IP66 weatherproofing.";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-navy p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green/20 text-green-light rounded-full text-xs font-semibold mb-3">
          <Car size={14} />
          Canberra EV Matchmaker
        </div>
        <h2
          className="text-2xl sm:text-3xl text-white mb-2 font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          EV Charger Sizing &amp; Selection Tool
        </h2>
        <p className="text-white/70 text-xs sm:text-sm">
          Select your vehicle and home electrical supply to find the best charger, charge speeds, and petrol savings.
        </p>
      </div>

      <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Vehicle Selection */}
          <div>
            <label className="text-sm font-bold text-navy block mb-2">Select Your Vehicle</label>
            <select
              value={selectedEv}
              onChange={(e) => setSelectedEv(e.target.value)}
              className="input-field font-medium text-navy"
            >
              {Object.entries(EV_MODELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Power Supply Phase */}
          <div>
            <label className="text-sm font-bold text-navy block mb-2">Home Power Supply</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "single", label: "Single-Phase (240V)" },
                { id: "three", label: "Three-Phase (415V)" },
                { id: "unsure", label: "Not Sure" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPowerPhase(p.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    powerPhase === p.id
                      ? "border-green bg-green/10 text-green font-bold shadow-sm"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              *If unsure, Justin will inspect your main switchboard during your free site assessment.
            </p>
          </div>

          {/* Rooftop Solar Presence */}
          <div>
            <label className="text-sm font-bold text-navy block mb-2">
              Do you have rooftop solar?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasSolar(true)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  hasSolar
                    ? "border-green bg-green/5 text-navy shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Sun size={15} className={hasSolar ? "text-green" : "text-gray-400"} />
                  <span className="text-xs font-bold">Yes (Charge with Solar)</span>
                </div>
                <p className="text-[11px] text-gray-400">Match charging with solar export.</p>
              </button>

              <button
                type="button"
                onClick={() => setHasSolar(false)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !hasSolar
                    ? "border-green bg-green/5 text-navy shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Zap size={15} className={!hasSolar ? "text-green" : "text-gray-400"} />
                  <span className="text-xs font-bold">No / Off-Peak Grid</span>
                </div>
                <p className="text-[11px] text-gray-400">Standard overnight charging.</p>
              </button>
            </div>
          </div>

          {/* Daily commute distance slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-navy">Daily Commute Distance</label>
              <span className="text-sm font-bold text-green font-mono">{dailyCommuteKm} km / day</span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={dailyCommuteKm}
              onChange={(e) => setDailyCommuteKm(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>15 km (Local)</span>
              <span>45 km (Canberra Avg)</span>
              <span>180 km (Regional NSW)</span>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-green-light bg-white/10 px-2.5 py-0.5 rounded-full mb-3">
              <Sparkles size={12} /> Top Recommendation
            </div>
            <h3
              className="text-2xl text-white font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {recommendedCharger}
            </h3>
            <p className="text-xs text-white/70 mb-6 leading-relaxed">{chargerReason}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Charge Speed</span>
                <span className="text-xl font-bold text-green-light font-mono">
                  +{rangePerHourKm} km/hr
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  ({chargingSpeedKw} kW output)
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Daily Commute Top-Up</span>
                <span className="text-xl font-bold text-white font-mono">
                  {dailyChargeMinutes < 60 ? `${dailyChargeMinutes} mins` : `${(dailyChargeMinutes / 60).toFixed(1)} hrs`}
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  Replenished easily overnight
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Full 0-100% Time</span>
                <span className="text-xl font-bold text-white font-mono">
                  ~{fullChargeHours} hrs
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  {vehicle.batteryKwh} kWh battery
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-white/60 block mb-0.5">Annual Fuel Savings</span>
                <span className="text-xl font-bold text-green-light font-mono">
                  ${annualSavings.toLocaleString()}
                </span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  vs petrol/diesel
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              href={`/quote?service=ev-chargers&charger=${encodeURIComponent(recommendedCharger)}`}
              className="btn-primary w-full !py-3.5 text-center justify-center flex text-sm"
            >
              Request Installation Quote <ArrowRight size={16} />
            </Link>
            <p className="text-[11px] text-center text-white/50">
              *Includes dedicated 32A circuit wiring, Type B RCD, and ACT compliance certificate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
