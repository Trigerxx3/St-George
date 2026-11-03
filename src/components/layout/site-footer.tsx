import Link from "next/link";
import { Phone, Mail, MapPin, Shield, Award, ArrowRight, ArrowUp } from "lucide-react";
import { BUSINESS, SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

const linkClass = "text-[#9fb2c8] hover:text-white transition-colors";
const headingClass = "text-white font-extrabold text-sm uppercase tracking-[0.14em] mb-5";

export default function SiteFooter() {
  const half = Math.ceil(SERVICE_AREAS.length / 2);
  const areaCols = [SERVICE_AREAS.slice(0, half), SERVICE_AREAS.slice(half)];

  return (
    <footer className="section-dark !bg-none bg-navy-950 text-[#9fb2c8]">
      {/* ─── Licence / Trust Strip ─── */}
      <div className="border-b border-white/10">
        <div className="container-custom py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <Shield size={16} className="text-orange" />
            ACT Licence #{BUSINESS.licence}
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-2">
            <Award size={16} className="text-orange" />
            Member: Master Electricians Australia
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Licensed &amp; Insured</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Australian Standards Compliant</span>
        </div>
      </div>

      {/* ─── Main Footer ─── */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl border border-orange/40 bg-white/5 flex items-center justify-center">
                <span className="text-orange-light font-extrabold text-lg">SG</span>
              </div>
              <div>
                <div className="text-white font-extrabold text-[15px] tracking-tight">St George Electrical</div>
                <div className="text-xs">Energy Solutions</div>
              </div>
            </div>
            <p className="text-sm mb-5 max-w-xs">{BUSINESS.tagline}</p>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white mb-6">
              <MapPin size={13} className="text-orange" />
              {BUSINESS.address.suburb}, {BUSINESS.address.state}
            </span>

            <div className="space-y-3 text-sm">
              <a href={phoneHref(BUSINESS.phone)} className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={16} className="text-orange shrink-0" />
                {BUSINESS.phoneDisplay}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 hover:text-white transition-colors break-all">
                <Mail size={16} className="text-orange shrink-0" />
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-orange shrink-0 mt-0.5" />
                <span>
                  {BUSINESS.address.suburb}, {BUSINESS.address.state} {BUSINESS.address.postcode}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2">
            <h3 className={headingClass}>Our Services</h3>
            <ul className="space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className={`${linkClass} inline-block hover:translate-x-1 transition-all`}>
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company / Quick Links */}
          <div className="lg:col-span-2">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className={linkClass}>Products</Link></li>
              <li><Link href="/gallery" className={linkClass}>Gallery</Link></li>
              <li><Link href="/quote" className={linkClass}>Get a Free Quote</Link></li>
              <li><Link href="/booking" className={linkClass}>Book a Service</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Service Areas (two sub-columns) */}
          <div className="lg:col-span-4">
            <h3 className={headingClass}>Service Areas</h3>
            <div className="grid grid-cols-2 gap-x-6">
              {areaCols.map((col, i) => (
                <ul key={i} className="space-y-3 text-sm">
                  {col.map((area) => (
                    <li key={area.slug}>
                      <Link href={`/areas/${area.slug}`} className={linkClass}>
                        {area.name}, {area.region}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <Link href="/contact" className="link-arrow mt-6 !text-orange-light">
              All service areas
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="divider-glow" />

      {/* ─── Bottom Bar ─── */}
      <div>
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2025 {BUSINESS.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link href="/warranty" className="hover:text-white transition-colors">Warranty</Link>
            <a href="#" className="inline-flex items-center gap-1 text-white hover:text-orange-light transition-colors" aria-label="Back to top">
              Back to top <ArrowUp size={13} />
            </a>
          </div>
        </div>
      </div>
      {/* Space so the mobile floating bar never covers the footer */}
      <div className="h-14 md:hidden" aria-hidden="true" />
    </footer>
  );
}
