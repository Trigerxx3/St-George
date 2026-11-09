"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, CheckCircle2, ArrowRight, Flame, ShieldCheck, Zap } from "lucide-react";
import { PACKAGES as DEFAULT_PACKAGES } from "@/lib/catalogue-data";
import { PackageItem } from "@/types/catalogue";

const STORAGE_KEY = "stg_admin_packages";

export default function PackageDealsPopup() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [packages, setPackages] = useState<PackageItem[]>([]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Mount effect: safely load client-side packages and handle auto-popup
  useEffect(() => {
    setIsMounted(true);

    // Initial packages from local storage or defaults
    let initialActive: PackageItem[] = [];
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialActive = parsed.filter((p: PackageItem) => p.isActive !== false);
        }
      }
    } catch {}

    if (initialActive.length === 0) {
      initialActive = DEFAULT_PACKAGES.filter((p) => p.isActive !== false);
    }
    setPackages(initialActive);

    // Fetch freshest packages from server
    const fetchActivePackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.packages)) {
            const activeOnly = data.packages.filter((p: PackageItem) => p.isActive !== false);
            setPackages(activeOnly);
          }
        }
      } catch {}
    };

    fetchActivePackages();

    // Check if user already dismissed popup in this session
    try {
      const dismissed = sessionStorage.getItem("stgeorge_deals_popup_dismissed");
      if (!dismissed && initialActive.length > 0) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2200);
        return () => clearTimeout(timer);
      }
    } catch {
      if (initialActive.length > 0) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen for storage events (e.g. package enabled/disabled in admin tab)
  useEffect(() => {
    if (!isMounted) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setPackages(parsed.filter((p: PackageItem) => p.isActive !== false));
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isMounted]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("stgeorge_deals_popup_dismissed", "true");
    } catch {}
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  // Only render on client after mounting, and only if active packages exist
  if (!isMounted || packages.length === 0) {
    return null;
  }

  // Find lowest price string for the trigger badge
  const startingPrice = packages.find((p) => p.price)?.price || "$6,799";

  const gridLayoutClass =
    packages.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : packages.length === 2
      ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      {/* Floating Re-open Badge Trigger:
          - Mobile: floats above the 56px mobile bottom bar at bottom-[72px] right-3
          - Tablet/Desktop: bottom-6 right-6
          - High z-index (z-40) and safe area support so it never gets cut off */}
      <div className="fixed bottom-[72px] md:bottom-6 right-3 sm:right-5 md:right-6 z-40 max-w-[calc(100vw-24px)]">
        <button
          type="button"
          onClick={openPopup}
          aria-label="Open Special Solar and Battery Deals"
          className="group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-orange-strong via-[#e8590c] to-[#d4380d] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-0 cursor-pointer"
        >
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0 animate-pulse">
            <Flame size={13} className="text-white fill-white sm:w-3.5 sm:h-3.5" />
          </span>
          <span className="tracking-tight sm:tracking-wide whitespace-nowrap">
            <span>Special Deals </span>
            <span className="font-extrabold text-yellow-300">from {startingPrice}</span>
          </span>
          <span className="text-white/80 group-hover:translate-x-0.5 transition-transform text-xs shrink-0">
            ↗
          </span>
        </button>
      </div>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Lock In Our Special Solar and Battery Prices"
        >
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity"
            onClick={closePopup}
            aria-hidden="true"
          />

          {/* Dialog Container:
              - Mobile: bottom sheet / full-screen drawer with rounded-t-3xl
              - Desktop: centered floating card with rounded-3xl */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-5xl h-[92dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#091827] text-white shadow-2xl border-0 overflow-hidden z-10 animate-scale-in"
          >
            {/* Top Close Button (Sticky & high contrast for easy tapping) */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closePopup}
              aria-label="Close deals modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Top Promotional Header */}
            <div className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-10 text-center bg-gradient-to-b from-[#102438] to-[#091827] border-0 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3 shadow-md">
                <Flame size={12} className="fill-white" />
                <span>Special Promotional Pricing</span>
              </div>

              <h2
                className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight uppercase mb-1.5 sm:mb-2 pr-8 sm:pr-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Lock In Our Special{" "}
                <span className="text-orange-strong underline decoration-orange-strong/40 underline-offset-4">
                  Solar + Battery
                </span>{" "}
                Prices
              </h2>

              <p className="text-white/80 text-xs sm:text-sm max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">
                Turnkey residential packages installed to Master Electricians standards. Eligible for{" "}
                <span className="text-white font-semibold">ACT 0% loans</span> with Federal STC rebates applied directly.
              </p>

              {/* Trust micro-badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5 mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-white/70">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={13} className="text-orange-strong shrink-0" /> NETR Approved
                </span>
                <span className="inline-flex items-center gap-1">
                  <Zap size={13} className="text-yellow-400 shrink-0" /> Full EvoEnergy Approval
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-green-400 shrink-0" /> 25-Yr Performance Warranty
                </span>
              </div>
            </div>

            {/* Scrollable Deals Grid */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
              <div className={`grid ${gridLayoutClass} gap-4 sm:gap-5`}>
                {packages.map((pkg, idx) => {
                  const isFeatured = idx === 0 || Boolean(pkg.featured);
                  return (
                    <article
                      key={pkg.id}
                      className={`relative flex flex-col rounded-2xl bg-[#0f243a] border-0 overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${
                        isFeatured ? "ring-2 ring-orange-strong shadow-orange-strong/20" : ""
                      }`}
                    >
                      {/* Ribbon / Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow ${
                            isFeatured
                              ? "bg-orange-strong text-white"
                              : "bg-navy-950/90 text-white/90 backdrop-blur"
                          }`}
                        >
                          {pkg.badge || "Turnkey Deal"}
                        </span>
                      </div>

                      {/* Package Visual */}
                      <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-navy-950">
                        <img
                          src={pkg.image || "/images/products/turnkey-6kw.jpg"}
                          alt={pkg.name}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/products/turnkey-6kw.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f243a] via-transparent to-transparent" />
                      </div>

                      {/* Package Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* System Size Heading */}
                          <h3 className="text-base sm:text-lg font-black text-white leading-tight mb-2">
                            {pkg.systemSize}
                          </h3>

                          {/* Price Tag Highlight */}
                          {pkg.price && (
                            <div className="my-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-[#c82333] text-white flex items-baseline justify-between shadow-md">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white/90">
                                Fully Installed
                              </span>
                              <span
                                className="text-xl sm:text-2xl font-black text-white tracking-tight"
                                style={{ fontFamily: "var(--font-heading)" }}
                              >
                                {pkg.price}
                              </span>
                            </div>
                          )}

                          <p className="text-white/70 text-xs leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                            {pkg.shortDesc}
                          </p>

                          {/* Included Specs List */}
                          {Array.isArray(pkg.includedItems) && pkg.includedItems.length > 0 && (
                            <ul className="space-y-1.5 mb-4 text-xs text-white/85">
                              {pkg.includedItems.slice(0, 3).map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-1.5">
                                  <CheckCircle2 size={13} className="text-orange-strong shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* CTA Actions */}
                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <Link
                            href={`/quote?package=${pkg.slug}`}
                            onClick={closePopup}
                            className="btn-primary !w-full !py-2.5 text-xs font-black tracking-wide justify-center shadow-lg active:scale-95 transition-transform"
                          >
                            Lock In {pkg.price || "Deal"} <ArrowRight size={14} className="ml-1" />
                          </Link>

                          <Link
                            href={`/packages/${pkg.slug}`}
                            onClick={closePopup}
                            className="inline-flex w-full items-center justify-center text-xs font-semibold text-white/70 hover:text-white py-1 transition-colors"
                          >
                            <span>View Full Specs</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Disclaimer & Dismiss Bar */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#06121f] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-white/60 text-center sm:text-left border-0 shrink-0">
              <p className="line-clamp-1 sm:line-clamp-none">
                *Special promotional pricing includes Federal STC rebate discounts and standard single-storey ACT installation.
              </p>
              <button
                type="button"
                onClick={closePopup}
                className="text-white/80 hover:text-white font-semibold text-xs whitespace-nowrap cursor-pointer underline underline-offset-2 py-1"
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
