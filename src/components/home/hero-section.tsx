import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, ShieldCheck, Zap, Sun } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center gradient-hero overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Atmospheric accent lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-green/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-orange/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7">
            {/* Licence badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs sm:text-sm mb-6">
              <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
              ACT Licence #{BUSINESS.licence} · Licensed &amp; Insured
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-in-up animate-delay-100 text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-4 font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Powering Your Home
              <br />
              &amp; Business with{" "}
              <span className="text-green">Confidence</span>
            </h1>

            {/* Tagline with accent font */}
            <p
              className="animate-fade-in-up animate-delay-200 text-2xl sm:text-3xl text-orange-light mb-5"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              {BUSINESS.tagline}
            </p>

            {/* Description */}
            <p className="animate-fade-in-up animate-delay-300 text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
              Solar panels, battery storage, EV chargers &amp; complete electrical services. 
              Serving Canberra, ACT &amp; surrounding regions with quality workmanship and zero shortcuts.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animate-delay-400 flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/quote" className="btn-primary text-base sm:text-lg !py-3.5 !px-8 shadow-xl">
                Get a Free Quote
                <ArrowRight size={20} />
              </Link>
              <a
                href={phoneHref(BUSINESS.phone)}
                className="btn-outline text-base sm:text-lg !py-3.5 !px-8"
              >
                <Phone size={20} />
                {BUSINESS.phoneDisplay}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in-up animate-delay-400 flex flex-wrap gap-x-6 gap-y-2 text-white/60 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-green" /> Free quotes &amp; consultations
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-green" /> Master Electricians member
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={16} className="text-green" /> Domestic · Commercial · Industrial
              </span>
            </div>
          </div>

          {/* Right Column: Hero Real Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full">
                <img
                  src="/images/hero/hero-solar-home.jpg"
                  alt="Modern Canberra home with rooftop solar panels installed by St George Electrical"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Quality Stamp */}
              <div className="absolute top-4 right-4 bg-navy/85 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <Sun size={14} className="text-orange" />
                <span>Tier-1 N-Type Solar</span>
              </div>

              {/* Floating Bottom Trust Callout */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-white shadow-xl text-navy">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                      Canberra Clean Energy Standard
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-navy">
                      0% Interest ACT Scheme Finance Available
                    </span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-green/10 text-green flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into white */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
