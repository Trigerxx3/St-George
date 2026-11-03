"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, RotateCcw, DollarSign } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import SectionHeading from "@/components/ui/section-heading";

/** Existing solar feature labels (previously in the Solar feature block). */
const SOLAR_POINTS = [
  "Premium Tier-1 solar panels",
  "Home battery backup systems",
  "Cut power bills up to 70%+",
  "Clean, renewable energy",
  "Residential & commercial",
  "Clean Energy Council accredited",
];

interface Hotspot {
  slug: string;
  /** position on the default photo, in % */
  x: number;
  y: number;
  image: string;
  alt: string;
  points: string[];
}

const HOTSPOTS: Hotspot[] = [
  {
    slug: "solar-battery",
    x: 62,
    y: 30,
    image: "/images/services/battery-storage.jpg",
    alt: "Tesla home battery storage and hybrid solar inverter installation in residential garage",
    points: SOLAR_POINTS,
  },
  {
    slug: "ev-chargers",
    x: 24,
    y: 68,
    image: "/images/services/ev-charger.jpg",
    alt: "Modern home EV wall charger charging electric vehicle",
    points: [],
  },
  {
    slug: "electrical",
    x: 78,
    y: 72,
    image: "/images/services/switchboard.jpg",
    alt: "Modern Australian electrical switchboard upgrade with RCBO safety switches",
    points: [],
  },
  {
    slug: "heating-cooling",
    x: 38,
    y: 44,
    image: "/images/hero/hero-solar-home.jpg",
    alt: "Split system and ducted air conditioning climate control",
    points: [],
  },
  {
    slug: "security-cctv",
    x: 82,
    y: 36,
    image: "/images/services/commercial-solar.jpg",
    alt: "Residential and commercial CCTV security camera systems",
    points: [],
  },
];

export default function ShowcaseHotspots() {
  const [active, setActive] = useState<string | null>(null);
  const activeSpot = HOTSPOTS.find((h) => h.slug === active) ?? null;
  const activeService = SERVICES.find((s) => s.slug === active) ?? null;

  return (
    <section className="section-dark section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="01 — Solar & Battery Solutions"
          line1="Smart. Sustainable."
          line2="Reliable."
          intro="Take control of your energy with premium solar panel and battery storage solutions designed for Australian conditions. Cut your electricity bills and power your home with clean energy."
        />

        <div className="relative rounded-3xl overflow-hidden border-0 shadow-2xl shadow-black/60 aspect-[4/5] sm:aspect-[16/10] bg-navy-light">
          {/* Default + per-service photos, cross-faded */}
          <img
            src="/images/hero/hero-solar-home.jpg"
            alt="Modern Canberra home with rooftop solar panels installed by St George Electrical"
            width={1600}
            height={1000}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              activeSpot ? "opacity-0" : "opacity-100"
            }`}
          />
          {HOTSPOTS.map((h) => (
            <img
              key={h.slug}
              src={h.image}
              alt={activeSpot?.slug === h.slug ? h.alt : ""}
              aria-hidden={activeSpot?.slug === h.slug ? undefined : true}
              width={1600}
              height={1000}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeSpot?.slug === h.slug ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-navy-950/30 pointer-events-none" />

          {/* Hotspot buttons (default view only) */}
          {!activeSpot &&
            HOTSPOTS.map((h) => {
              const svc = SERVICES.find((s) => s.slug === h.slug)!;
              return (
                <button
                  key={h.slug}
                  type="button"
                  onClick={() => setActive(h.slug)}
                  aria-label={`Show ${svc.title}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-navy-950/60 backdrop-blur border border-orange text-orange-light hover:bg-orange-strong hover:text-white hover:scale-110 transition-all shadow-[0_0_24px_rgba(232,117,26,0.5)]"
                >
                  <Plus size={20} />
                  <span className="hidden sm:block absolute top-full mt-2 whitespace-nowrap rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    {svc.shortTitle}
                  </span>
                </button>
              );
            })}

          {/* Existing savings callout (default view) */}
          {!activeSpot && (
            <div className="absolute right-4 bottom-4 card-glass !bg-navy-950/60 p-3.5 max-w-[260px] hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/15 flex items-center justify-center shrink-0">
                  <DollarSign size={18} className="text-orange-light" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-light uppercase tracking-[0.14em] font-bold">Average Savings</p>
                  <p className="text-lg font-extrabold text-white leading-tight">Up to 70% – 85%</p>
                  <p className="text-[11px] text-[#9fb2c8]">ACT Scheme 0% Finance</p>
                </div>
              </div>
            </div>
          )}

          {/* Hint (default view) */}
          {!activeSpot && (
            <p className="absolute left-4 bottom-4 text-xs text-white/80 card-glass !rounded-full px-3 py-1.5">
              Tap a + to explore
            </p>
          )}

          {/* Glass info card (left) */}
          {activeSpot && activeService && (
            <div
              className="absolute left-3 right-3 bottom-3 sm:left-6 sm:right-auto sm:top-6 sm:bottom-6 sm:w-[360px] card-glass !bg-navy-950/75 p-6 flex flex-col animate-fade-in overflow-y-auto"
              role="region"
              aria-live="polite"
              aria-label={activeService.title}
            >
              <span className="eyebrow mb-3 !text-orange-light">{activeService.tagline}</span>
              <h3 className="text-2xl text-white mb-3">{activeService.title}</h3>
              <p className="text-sm text-[#c3d0df] leading-relaxed mb-4">{activeService.description}</p>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-[#c3d0df] mb-5">
                {(activeSpot.points.length ? activeSpot.points : activeService.features.slice(0, 4)).map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-3">
                <Link href={activeService.href} className="link-arrow !text-orange-light">
                  Explore this solution
                  <ArrowUpRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white rounded-full border border-white/20 px-3 py-1.5 transition-colors"
                >
                  <RotateCcw size={13} />
                  Reset view
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard / no-pointer fallback: plain quote CTAs from the original block */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/solar-battery" className="btn-primary">
            Learn More
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/quote?service=solar-battery" className="btn-outline">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

