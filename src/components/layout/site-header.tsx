"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { BUSINESS, NAV_ITEMS, type NavItem } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ─── Top Info Bar (desktop only) ─── */}
      <div className="hidden lg:block bg-navy text-white/80 text-sm">
        <div className="container-custom flex items-center justify-between py-1.5">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              <a
                href={phoneHref(BUSINESS.phone)}
                className="hover:text-white transition-colors"
              >
                {BUSINESS.phoneDisplay}
              </a>
            </span>
            <span className="text-white/40">|</span>
            <span>ACT Licence #{BUSINESS.licence}</span>
            <span className="text-white/40">|</span>
            <span>Licensed &amp; Insured</span>
          </div>
          <span>Member: Master Electricians Australia</span>
        </div>
      </div>

      {/* ─── Main Header ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container-custom flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* TODO_OWNER: Replace with actual logo from /public/brand/logo.svg */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-green font-bold text-lg lg:text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                SG
              </span>
            </div>
            <div className="hidden sm:block">
              <div
                className="text-navy font-bold text-sm lg:text-base leading-tight uppercase tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                St George Electrical
              </div>
              <div className="text-gray-500 text-xs leading-tight">
                Energy Solutions
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-navy font-medium text-sm transition-colors rounded-md hover:bg-gray-100/50"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-gray-700 hover:text-navy font-medium text-sm transition-colors rounded-md hover:bg-gray-100/50"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-1 z-50 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-navy hover:bg-off-white transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side: Phone + CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Phone (desktop) */}
            <a
              href={phoneHref(BUSINESS.phone)}
              className="hidden md:flex items-center gap-2 text-navy font-semibold text-sm hover:text-green transition-colors"
              aria-label={`Call us at ${BUSINESS.phoneDisplay}`}
            >
              <Phone size={16} />
              <span>{BUSINESS.phoneDisplay}</span>
            </a>

            {/* CTA Button */}
            <Link href="/quote" className="btn-primary text-sm !py-2.5 !px-5">
              Get a Free Quote
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Overlay ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white overflow-y-auto shadow-xl animate-fade-in">
            <div className="p-6 pt-20">
              {/* Licence info */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  ACT Licence #{BUSINESS.licence} · Licensed &amp; Insured
                </p>
              </div>

              {/* Nav Items */}
              <nav className="space-y-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    item={item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              {/* Contact */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                <a
                  href={phoneHref(BUSINESS.phone)}
                  className="flex items-center gap-3 text-navy font-semibold"
                >
                  <Phone size={18} />
                  {BUSINESS.phoneDisplay}
                </a>
                <Link
                  href="/quote"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Mobile Nav Item (with accordion for children) ─── */
function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="block py-3 px-3 text-gray-700 font-medium hover:text-navy hover:bg-off-white rounded-md transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-3 px-3 text-gray-700 font-medium hover:text-navy hover:bg-off-white rounded-md transition-colors"
        aria-expanded={expanded}
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="ml-4 border-l-2 border-green/20 pl-3 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block py-2 px-3 text-sm text-gray-600 hover:text-navy hover:bg-off-white rounded-md transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
