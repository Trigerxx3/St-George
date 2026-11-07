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
      : "grid-cols-1 md:grid-cols-3";

  return (
    <>
      {/* Floating Re-open Badge Trigger (Always accessible at bottom corner) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={openPopup}
          aria-label="Open Special Solar and Battery Deals"
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-strong to-[#d4380d] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-0 cursor-pointer"
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Flame size={14} className="text-white fill-white" />
          </span>
          <span className="tracking-wide">
            Special Deals <span className="font-extrabold text-yellow-300">from {startingPrice}</span>
          </span>
          <span className="text-white/80 group-hover:translate-x-0.5 transition-transform text-xs">
            ↗
          </span>
        </button>
      </div>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Lock In Our Special Solar and Battery Prices"
        >
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity"
            onClick={closePopup}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091827] text-white shadow-2xl border-0 overflow-hidden my-auto z-10 animate-scale-in"
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closePopup}
              aria-label="Close deals modal"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border-0"
            >
              <X size={20} />
            </button>

            {/* Top Promotional Header */}
            <div className="relative pt-8 pb-6 px-6 sm:px-10 text-center bg-gradient-to-b from-[#102438] to-[#091827] border-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-md">
                <Flame size={14} className="fill-white" />
                <span>Special Promotional Pricing</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Lock In Our Special{" "}
                <span className="text-orange-strong underline decoration-orange-strong/40 underline-offset-4">
                  Solar + Battery
                </span>{" "}
                Prices
              </h2>

              <p className="text-white/80 text-xs sm:text-sm max-w-2xl mx-auto">
                Turnkey residential packages installed to Master Electricians standards. Eligible for{" "}
                <span className="text-white font-semibold">ACT Sustainable Household Scheme 0% loans</span>{" "}
                with upfront Federal STC rebates applied directly.
              </p>

              {/* Trust micro-badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-[11px] sm:text-xs text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-orange-strong" /> New Energy Tech Approved Seller
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap size={14} className="text-yellow-400" /> Full EvoEnergy Approval
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-400" /> 25-Year Performance Warranty
                </span>
              </div>
            </div>

            {/* Scrollable Deals Grid */}
            <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(92vh-220px)]">
              <div className={`grid ${gridLayoutClass} gap-5`}>
                {packages.map((pkg, idx) => {
                  const isFeatured = idx === 0 || Boolean(pkg.featured);
                  return (
                    <article
                      key={pkg.id}
                      className={`relative flex flex-col rounded-2xl bg-[#0f243a] overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl ${
                        isFeatured ? "ring-2 ring-orange-strong shadow-orange-strong/20" : ""
                      }`}
                    >
                      {/* Ribbon / Badge */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow ${
                            isFeatured
                              ? "bg-orange-strong text-white"
                              : "bg-navy-950/90 text-white/90 backdrop-blur"
                          }`}
                        >
                          {pkg.badge || "Turnkey Deal"}
                        </span>
                      </div>

                      {/* Package Visual */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
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
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* System Size Heading */}
                          <h3 className="text-lg font-black text-white leading-tight mb-2">
                            {pkg.systemSize}
                          </h3>

                          {/* Price Tag Highlight */}
                          {pkg.price && (
                            <div className="my-3 py-2 px-3.5 rounded-xl bg-gradient-to-r from-red-600 to-[#c82333] text-white flex items-baseline justify-between shadow-md">
                              <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">
                                Fully Installed
                              </span>
                              <span
                                className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                                style={{ fontFamily: "var(--font-heading)" }}
                              >
                                {pkg.price}
                              </span>
                            </div>
                          )}

                          <p className="text-white/70 text-xs leading-relaxed mb-4">
                            {pkg.shortDesc}
                          </p>

                          {/* Included Specs List */}
                          {Array.isArray(pkg.includedItems) && pkg.includedItems.length > 0 && (
                            <ul className="space-y-2 mb-5 text-xs text-white/85">
                              {pkg.includedItems.slice(0, 4).map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={13} className="text-orange-strong shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{item}</span>
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
                            className="btn-primary !w-full !py-2.5 text-xs font-black tracking-wide justify-center shadow-lg"
                          >
                            Lock In {pkg.price || "Deal"} <ArrowRight size={14} className="ml-1" />
                          </Link>

                          <Link
                            href={`/packages/${pkg.slug}`}
                            onClick={closePopup}
                            className="inline-flex w-full items-center justify-center text-xs font-semibold text-white/70 hover:text-white py-1.5 transition-colors"
                          >
                            <span>View Full Package Specs</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="px-6 py-4 bg-[#06121f] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/60 text-center sm:text-left border-0">
              <p>
                *Special promotional pricing includes point-of-sale Federal STC rebate discounts and standard single-storey ACT installation. Subject to technical site assessment.
              </p>
              <button
                type="button"
                onClick={closePopup}
                className="text-white/80 hover:text-white font-semibold text-xs whitespace-nowrap cursor-pointer underline underline-offset-2"
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
