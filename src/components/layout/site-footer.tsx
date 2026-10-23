import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
} from "lucide-react";
import { BUSINESS, SERVICES, SECTORS, SERVICE_AREAS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export default function SiteFooter() {
  return (
    <footer className="bg-navy text-white/80">
      {/* ─── Licence / Trust Strip ─── */}
      <div className="border-b border-white/10">
        <div className="container-custom py-4 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
          <span className="flex items-center gap-2">
            <Shield size={16} className="text-green" />
            ACT Licence #{BUSINESS.licence}
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-2">
            <Award size={16} className="text-green" />
            Member: Master Electricians Australia
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Licensed &amp; Insured</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Australian Standards Compliant</span>
        </div>
      </div>

      {/* ─── Main Footer ─── */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: About & Contact */}
          <div className="lg:col-span-1">
            {/* Logo placeholder */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-green font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  SG
                </span>
              </div>
              <div>
                <div
                  className="text-white font-bold text-sm uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  St George Electrical
                </div>
                <div className="text-white/50 text-xs">Energy Solutions</div>
              </div>
            </div>
            <p className="text-sm mb-6 text-white/60">
              {BUSINESS.tagline}
            </p>

            <div className="space-y-3 text-sm">
              <a
                href={phoneHref(BUSINESS.phone)}
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Phone size={16} className="text-green shrink-0" />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Mail size={16} className="text-green shrink-0" />
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-green shrink-0 mt-0.5" />
                <span>
                  {BUSINESS.address.suburb}, {BUSINESS.address.state}{" "}
                  {BUSINESS.address.postcode}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3
              className="text-white font-bold text-sm uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10">
                <span className="text-white/40 text-xs uppercase tracking-wider">Sectors</span>
              </li>
              {SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3
              className="text-white font-bold text-sm uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">Solar Calculator</Link></li>
              <li><Link href="/rebates" className="hover:text-white transition-colors">Rebates &amp; Incentives</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Project Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div>
            <h3
              className="text-white font-bold text-sm uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Service Areas
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_AREAS.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/areas/${area.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {area.name}, {area.region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            © 2025 {BUSINESS.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/warranty" className="hover:text-white/70 transition-colors">
              Warranty
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
