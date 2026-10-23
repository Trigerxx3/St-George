"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  BatteryCharging,
  Wrench,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface Project {
  id: string;
  title: string;
  category: "solar" | "ev" | "electrical" | "commercial";
  categoryLabel: string;
  suburb: string;
  system: string;
  description: string;
  results: string[];
  clientQuote?: string;
  clientName?: string;
}

const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "10kW High-Yield Solar + Tesla Powerwall 3",
    category: "solar",
    categoryLabel: "Solar & Battery",
    suburb: "Gungahlin, ACT",
    system: "10.1kW Solar + 13.5kWh Tesla Powerwall 3",
    description:
      "Installed 23x Jinko N-Type TOPCon panels paired with the new Tesla Powerwall 3 to provide full home blackout protection and wipe out quarterly bills exceeding $1,100.",
    results: [
      "Zero grid power drawn between 5:00 PM and 10:00 PM peak",
      "Full whole-home EPS backup powering ducted heating during storms",
      "Financed via the ACT Sustainable Household Scheme 0% loan",
    ],
    clientQuote: "Justin was fantastic from the first measure to the final app handover. Our power bill dropped by over 85% in the first quarter.",
    clientName: "Mark & Sandra T.",
  },
  {
    id: "proj-2",
    title: "Dual 22kW EV Charging Station & Sub-Panel",
    category: "ev",
    categoryLabel: "EV Chargers",
    suburb: "Fyshwick, ACT",
    system: "2x 22kW Three-Phase Commercial Fast Chargers",
    description:
      "Commercial fleet depot electrical upgrade including new sub-distribution board, Type B safety protection, and load management for EV fleet vans.",
    results: [
      "Overnight full fleet charging ready for morning dispatch",
      "Dynamic load balancing prevents exceeding commercial maximum demand",
      "Full EvoEnergy network approval handled seamlessly",
    ],
    clientQuote: "Professional electrical engineering from start to finish. Zero disruption to our business operations.",
    clientName: "David L., Fleet Operations",
  },
  {
    id: "proj-3",
    title: "Complete Switchboard Modernisation & Rewire",
    category: "electrical",
    categoryLabel: "Electrical",
    suburb: "Belconnen, ACT",
    system: "Clipsal Resi9 RCBO Enclosure + Asbestos Panel Removal",
    description:
      "Removed dangerous 1970s rewirable ceramic fuses and deteriorating asbestos backing panel. Installed individual combination safety switches on every circuit.",
    results: [
      "100% compliant with AS/NZS 3000:2018 Wiring Rules",
      "Sub-millisecond trip protection against electric shocks",
      "Official ACT Certificate of Compliance lodged with Access Canberra",
    ],
    clientQuote: "Peace of mind knowing our older home is now completely safe for our children. Neat and tidy work.",
    clientName: "Elena R.",
  },
  {
    id: "proj-4",
    title: "6.6kW Essential Solar Array",
    category: "solar",
    categoryLabel: "Solar & Battery",
    suburb: "Tuggeranong, ACT",
    system: "15x Trina Dual-Glass 435W Panels + 5kW Inverter",
    description:
      "Clean rooftop solar installation optimized for winter morning sun angles in south Canberra. Wi-Fi monitoring configured for live smartphone tracking.",
    results: [
      "Generates approximately 26 kWh of clean energy per day",
      "Upfront Federal STC discount applied directly at point of sale",
      "Payback period calculated at under 3.8 years",
    ],
    clientQuote: "Justin provided an honest quote without any pushy sales tactics. Highly recommend St George Electrical.",
    clientName: "Peter K.",
  },
  {
    id: "proj-5",
    title: "Commercial 30kW Solar & LED High-Bay Fitout",
    category: "commercial",
    categoryLabel: "Commercial",
    suburb: "Hume, ACT",
    system: "30kW Commercial Array + 24x Industrial LED High-Bays",
    description:
      "Warehouse energy transformation reducing daytime operational load and upgrading dim halogen warehouse lights to energy-saving tri-colour LEDs.",
    results: [
      "Warehouse lighting electricity reduced by 72%",
      "Offsets daytime compressor and machinery power consumption",
      "Eligible for immediate business tax depreciation",
    ],
    clientQuote: "St George delivered the project on time and within budget. The warehouse is brighter and our energy costs plunged.",
    clientName: "Andrew B., Facility Manager",
  },
  {
    id: "proj-6",
    title: "Solar-Smart Zappi EV Charger Installation",
    category: "ev",
    categoryLabel: "EV Chargers",
    suburb: "Woden, ACT",
    system: "Myenergi Zappi 7.4kW + Dedicated 32A Run",
    description:
      "Integrated with client's existing solar array. Configured in Eco+ mode to charge their Tesla Model Y purely with excess solar generation.",
    results: [
      "100% fuel-free daily commuting powered by sunshine",
      "Weatherproof outdoor installation with neat concealed conduit",
      "Integrated CT clamps prevent home main switch overload",
    ],
    clientQuote: "Charging my car on pure solar feels incredible. Great advice and meticulous electrical installation.",
    clientName: "Simon G.",
  },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            ACT Licence #{BUSINESS.licence} · Proven Workmanship
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Project Gallery &amp; Case Studies
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Real installations across Canberra homes, commercial facilities, and industrial premises. Quality workmanship backed by warranties.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {[
            { id: "all", label: "All Projects" },
            { id: "solar", label: "Solar & Batteries" },
            { id: "ev", label: "EV Chargers" },
            { id: "electrical", label: "Switchboards & Electrical" },
            { id: "commercial", label: "Commercial" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.id
                  ? "bg-green text-white shadow-sm"
                  : "bg-white text-gray-700 hover:border-green/40 hover:text-green border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="card bg-white hover:border-green/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-green uppercase tracking-wider">
                    {proj.categoryLabel}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    <MapPin size={13} className="text-gray-400" /> {proj.suburb}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-navy mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {proj.title}
                </h3>

                <div className="inline-block px-2.5 py-1 bg-off-white text-navy font-mono text-xs rounded-md mb-4 border border-gray-100 font-semibold">
                  {proj.system}
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5">
                  {proj.description}
                </p>

                {/* Outcomes list */}
                <div className="mb-5 space-y-2">
                  <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                    Key Outcomes:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {proj.results.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Review callout */}
              {proj.clientQuote && (
                <div className="pt-4 border-t border-gray-100 bg-off-white/50 -mx-6 -mb-6 p-5 rounded-b-xl">
                  <div className="flex items-center gap-1 text-orange mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-1.5">
                    &ldquo;{proj.clientQuote}&rdquo;
                  </p>
                  <span className="text-[11px] font-bold text-navy block">
                    — {proj.clientName}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-navy rounded-2xl p-8 sm:p-10 text-white text-center max-w-3xl mx-auto shadow-xl">
          <h3
            className="text-2xl sm:text-3xl text-white mb-3 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready for a High-Quality Electrical Installation?
          </h3>
          <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
            Discuss your home or business requirements directly with Justin George. Get a transparent, obligation-free quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote" className="btn-primary !py-3 !px-7">
              Request Your Free Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
