"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/lib/constants";

/** Routes whose first section is a dark hero, so the header can sit transparently on top of it. */
const DARK_HERO_ROUTES = ["/solar-battery", "/ev-chargers", "/electrical", "/heating-cooling", "/security-cctv", "/quote", "/about", "/areas"];

function isActive(pathname: string | null, item: NavItem): boolean {
  if (!pathname) return false;
  if (item.href !== "#" && (pathname === item.href || pathname.startsWith(item.href + "/"))) return true;
  return !!item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const overlay =
    pathname === "/" || DARK_HERO_ROUTES.some((r) => pathname === r || pathname?.startsWith(r + "/"));
  const transparent = overlay && !isScrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* ─── Main Header ─── */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          overlay ? "-mb-16 lg:-mb-[76px]" : ""
        } ${
          transparent
            ? "bg-transparent border-transparent"
            : isScrolled
            ? "bg-navy-950/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20"
            : "bg-navy-950/80 backdrop-blur-xl border-white/5"
        }`}
      >
        <div className="container-custom flex items-center justify-between gap-4 h-16 lg:h-[76px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="St George Electrical Energy Solutions home">
            {/* TODO_OWNER: Replace with actual logo from /public/brand/logo.svg */}
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl border border-orange/40 bg-white/5 flex items-center justify-center">
              <span className="text-orange-light font-extrabold text-base lg:text-lg">SG</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-extrabold text-sm lg:text-[15px] leading-tight tracking-tight">
                St George Electrical
              </div>
              <div className="text-[#9fb2c8] text-xs leading-tight">Energy Solutions</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 flex-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item);
              const open = openDropdown === item.label;
              const itemClass = `relative flex items-center gap-1 px-2.5 xl:px-3 py-2 text-[13px] xl:text-sm font-semibold transition-colors rounded-md ${
                active ? "text-white" : "text-[#c3d0df] hover:text-white"
              }`;
              const underline = (
                <span
                  className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 rounded-full bg-orange transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              );
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className={itemClass}
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => setOpenDropdown(open ? null : item.label)}
                      onKeyDown={(e) => e.key === "Escape" && setOpenDropdown(null)}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                      {underline}
                    </button>
                  ) : (
                    <Link href={item.href} className={itemClass} aria-current={active ? "page" : undefined}>
                      {item.label}
                      {underline}
                    </Link>
                  )}

                  {item.children && open && (
                    <div className="absolute top-full left-0 pt-2 z-50 animate-fade-in">
                      <div className="rounded-xl border border-white/10 bg-navy-950/95 backdrop-blur-xl shadow-2xl shadow-black/40 py-2 min-w-[220px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-[#c3d0df] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Side: CTA + Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/quote" className="btn-primary !py-2.5 !px-4 sm:!px-5">
              Get a Free Quote
              <ArrowUpRight size={16} />
            </Link>

            <button
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-navy-950 border-l border-white/10 overflow-y-auto shadow-xl animate-fade-in">
            <div className="p-6 pt-20">
              <nav className="space-y-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    item={item}
                    active={isActive(pathname, item)}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href="/quote"
                  className="btn-primary w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a Free Quote
                  <ArrowUpRight size={16} />
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
  active,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const base = "block py-3 px-3 font-semibold rounded-md transition-colors";
  const tone = active ? "text-white" : "text-[#c3d0df] hover:text-white hover:bg-white/5";

  if (!item.children) {
    return (
      <Link href={item.href} onClick={onClose} className={`${base} ${tone}`} aria-current={active ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between py-3 px-3 font-semibold rounded-md transition-colors ${tone}`}
        aria-expanded={expanded}
      >
        <span className={active ? "border-b-2 border-orange pb-0.5" : ""}>{item.label}</span>
        <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="ml-4 border-l border-orange/30 pl-3 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block py-2 px-3 text-sm text-[#9fb2c8] hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
