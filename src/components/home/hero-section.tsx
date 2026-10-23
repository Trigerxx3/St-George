import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center gradient-hero overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Accent glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-green/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-orange/10 rounded-full blur-[100px]" />

      <div className="container-custom relative z-10 py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Licence badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm mb-6">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            ACT Licence #{BUSINESS.licence} · Licensed &amp; Insured
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-in-up animate-delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Powering Your Home
            <br />
            &amp; Business with{" "}
            <span className="text-green">Confidence</span>
          </h1>

          {/* Tagline with accent font */}
          <p
            className="animate-fade-in-up animate-delay-200 text-2xl sm:text-3xl text-orange-light mb-6"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            {BUSINESS.tagline}
          </p>

          {/* Description */}
          <p className="animate-fade-in-up animate-delay-300 text-lg text-white/70 max-w-xl mb-8">
            Solar panels, battery storage, EV chargers &amp; complete electrical services. 
            Serving Canberra, ACT &amp; surrounding regions.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animate-delay-400 flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/quote" className="btn-primary text-lg !py-3.5 !px-8">
              Get a Free Quote
              <ArrowRight size={20} />
            </Link>
            <a
              href={phoneHref(BUSINESS.phone)}
              className="btn-outline text-lg !py-3.5 !px-8"
            >
              <Phone size={20} />
              {BUSINESS.phoneDisplay}
            </a>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up animate-delay-400 flex flex-wrap gap-x-6 gap-y-2 text-white/50 text-sm">
            <span>✓ Free quotes &amp; consultations</span>
            <span>✓ Master Electricians member</span>
            <span>✓ Domestic · Commercial · Industrial</span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
