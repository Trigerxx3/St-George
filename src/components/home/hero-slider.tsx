"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Sun,
  Zap,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface Slide {
  id: string;
  image: string;
  alt: string;
  badgeIcon: typeof Sun;
  badgeText: string;
  title: string;
  subtitle: string;
  href: string;
}

const SLIDE_DURATION = 4500; // 4.5 seconds per slide

const SLIDES: Slide[] = [
  {
    id: "battery-storage",
    image: "/images/services/battery-storage.jpg",
    alt: "Modern home battery storage and smart inverter installation in Canberra",
    badgeIcon: BatteryCharging,
    badgeText: "Lithium Home Battery Storage",
    title: "Blackout Protection & Bill Reduction",
    subtitle: "0% Interest ACT Scheme Finance Available",
    href: "/solar-battery",
  },
  {
    id: "solar-power",
    image: "/images/services/commercial-solar.jpg",
    alt: "High-efficiency residential and commercial rooftop solar panel array",
    badgeIcon: Sun,
    badgeText: "Tier-1 N-Type Solar Arrays",
    title: "Engineered for Canberra Climates",
    subtitle: "Premium 25-Year Warranty Tier-1 Hardware",
    href: "/solar-battery",
  },
  {
    id: "ev-charger",
    image: "/images/services/ev-charger.jpg",
    alt: "Smart electric vehicle fast charger installation for home and business",
    badgeIcon: Zap,
    badgeText: "Smart EV Charger Installation",
    title: "Fast Level 2 Home & Business Charging",
    subtitle: "Solar-Integrated Smart Charging Stations",
    href: "/ev-chargers",
  },
  {
    id: "switchboard-safety",
    image: "/images/services/switchboard.jpg",
    alt: "Compliant switchboard upgrade with modern RCBO safety switches",
    badgeIcon: ShieldCheck,
    badgeText: "Switchboards & Safety Upgrades",
    title: "AS/NZS 3000 Standards Compliant",
    subtitle: "Licensed Master Electricians Workmanship",
    href: "/electrical",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  // Timer loop tracking progress & auto-switching slides
  useEffect(() => {
    if (isPaused) return;

    const stepMs = 50;
    const increment = (stepMs / SLIDE_DURATION) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return Math.min(100, prev + increment);
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const currentSlide = SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div
      className="relative pb-12 lg:pb-14 lg:pl-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Clean Energy Services Showcase Carousel"
    >
      {/* ─── Main Image Frame ─── */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-black/60 group bg-navy-950">
        <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={1200}
                  height={1500}
                  fetchPriority={index === 0 ? "high" : "low"}
                  className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Top-Right Floating Category Badge */}
        <div className="absolute top-4 right-4 z-20 card-glass !rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-2 backdrop-blur-md border border-white/20 text-white shadow-lg animate-fade-in">
          <BadgeIcon size={14} className="text-orange" />
          <span>{currentSlide.badgeText}</span>
        </div>

        {/* Slide Indicator & Live Progress Timeline (Bottom of Image) */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-center gap-2">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.badgeText}`}
                className="group relative py-1 focus:outline-none"
              >
                <div
                  className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "w-10 sm:w-14 bg-white/20"
                      : "w-3 sm:w-4 bg-white/25 hover:bg-white/50"
                  }`}
                >
                  {isActive && (
                    <div
                      className="h-full bg-orange rounded-full transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {isCompleted && (
                    <div className="h-full w-full bg-orange/60 rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Overlapping Interactive Glass Info Card ─── */}
      <Link
        href={currentSlide.href}
        className="group/card absolute left-3 right-3 bottom-0 lg:-left-8 lg:right-4 z-30 card-glass !bg-navy-950/90 backdrop-blur-xl p-4 sm:p-4.5 rounded-2xl shadow-2xl border border-white/15 hover:border-orange/40 transition-all flex items-center justify-between gap-3 block"
      >
        <div className="min-w-0">
          <span className="text-[10px] sm:text-[11px] uppercase font-bold text-orange-light tracking-[0.14em] block mb-1">
            {currentSlide.title}
          </span>
          <span className="text-xs sm:text-sm font-bold text-white block truncate group-hover/card:text-orange transition-colors">
            {currentSlide.subtitle}
          </span>
        </div>
        <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange/15 text-orange group-hover/card:bg-orange group-hover/card:text-white flex items-center justify-center shrink-0 transition-colors">
          <ArrowUpRight size={18} />
        </span>
      </Link>
    </div>
  );
}


