import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface ServiceCTAProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
}

export default function ServiceCTA({
  title = "Ready to Upgrade Your Energy System?",
  subtitle = "Speak directly with Justin George for an honest, obligation-free quotation tailored to your property.",
  primaryCtaText = "Request a Free Quote",
  primaryCtaHref = "/quote",
}: ServiceCTAProps) {
  return (
    <section className="relative py-16 lg:py-20 bg-navy text-white overflow-hidden">
      {/* Decorative accent glow */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-green/15 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 left-0 w-96 h-96 bg-orange/10 rounded-full blur-[100px]" />

      <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-green-light font-medium mb-4">
          <Zap size={14} />
          Fast Response Guaranteed · Canberra & Surrounds
        </div>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>

        <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link href={primaryCtaHref} className="btn-primary text-base sm:text-lg !py-3.5 !px-8 w-full sm:w-auto">
            {primaryCtaText}
            <ArrowRight size={18} />
          </Link>
          <a
            href={phoneHref(BUSINESS.phone)}
            className="btn-outline text-base sm:text-lg !py-3.5 !px-8 w-full sm:w-auto"
          >
            <Phone size={18} />
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-green" /> ACT Licence #{BUSINESS.licence}
          </span>
          <span>•</span>
          <span>Master Electricians Member</span>
          <span>•</span>
          <span>No Obligation Free Estimate</span>
        </div>
      </div>
    </section>
  );
}
