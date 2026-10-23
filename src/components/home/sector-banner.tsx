"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Building2, Factory, ArrowRight } from "lucide-react";
import { SECTORS } from "@/lib/constants";

const ICONS = {
  Home: Home,
  Building2: Building2,
  Factory: Factory,
} as const;

export default function SectorBanner() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding bg-navy text-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experienced · Trusted ·{" "}
            <span className="text-green">Proven</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Servicing all sectors across Canberra, ACT and surrounding regions.
          </p>
        </div>

        {/* Sector tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {SECTORS.map((sector, i) => {
            const Icon = ICONS[sector.icon as keyof typeof ICONS];
            return (
              <button
                key={sector.slug}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  active === i
                    ? "bg-green text-white shadow-md"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon size={18} />
                {sector.title}
              </button>
            );
          })}
        </div>

        {/* Active sector content */}
        <div className="max-w-3xl mx-auto text-center animate-fade-in" key={active}>
          <h3
            className="text-2xl sm:text-3xl mb-3 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {SECTORS[active].title}
          </h3>
          <p
            className="text-xl text-orange-light mb-4"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            {SECTORS[active].tagline}
          </p>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            {SECTORS[active].description}
          </p>
          <Link
            href={SECTORS[active].href}
            className="btn-primary text-lg"
          >
            Explore {SECTORS[active].title}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
