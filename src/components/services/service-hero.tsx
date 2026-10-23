import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface ServiceHeroProps {
  title: string;
  tagline?: string;
  description: string;
  badge?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
}

export default function ServiceHero({
  title,
  tagline,
  description,
  badge = `ACT Licence #${BUSINESS.licence} · Licensed & Insured`,
  primaryCtaText = "Request a Free Quote",
  primaryCtaHref = "/quote",
}: ServiceHeroProps) {
  return (
    <section className="relative min-h-[460px] lg:min-h-[520px] flex items-center gradient-hero overflow-hidden">
      {/* Background radial pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* Atmospheric lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-green/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-orange/10 rounded-full blur-[100px]" />

      <div className="container-custom relative z-10 py-14 lg:py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs sm:text-sm mb-5">
            <ShieldCheck size={16} className="text-green-light" />
            <span>{badge}</span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>

          {/* Tagline */}
          {tagline && (
            <p
              className="text-xl sm:text-2xl text-orange-light mb-4"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              {tagline}
            </p>
          )}

          {/* Description */}
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link href={primaryCtaHref} className="btn-primary text-base sm:text-lg !py-3.5 !px-7">
              {primaryCtaText}
              <ArrowRight size={18} />
            </Link>
            <a
              href={phoneHref(BUSINESS.phone)}
              className="btn-outline text-base sm:text-lg !py-3.5 !px-7"
            >
              <Phone size={18} />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>

          {/* Trust bullet row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60 text-xs sm:text-sm">
            <span>✓ Certified Clean Energy Council Standard</span>
            <span>✓ Master Electricians Member</span>
            <span>✓ 100% ACT & NSW Compliant</span>
          </div>
        </div>
      </div>

      {/* Bottom fade into page content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
