import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import WireLine from "@/components/ui/wire-line";
import HeroSlider from "@/components/home/hero-slider";

export default function HeroSection() {
  return (
    <section className="section-dark relative overflow-hidden bg-navy-950">
      {/* ─── Hero Background Image + Atmospheric Overlay ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/hero/hero-solar-home.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Horizontal dark gradient: deeper on left for text readability, softer on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/70" />
        {/* Vertical gradient: blends seamlessly with transparent header & bottom transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/40 to-navy-950" />
        {/* Subtle radial warmth glow matching brand orange */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 450px at 15% 25%, rgba(232, 117, 26, 0.18), transparent 70%)",
          }}
        />
      </div>

      <WireLine className="left-0 right-0 bottom-0 w-full h-40 opacity-70 z-0" variant="sweep" />

      <div className="container-custom relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
          {/* Left: copy & actions */}
          <div className="lg:col-span-7">
            <span className="animate-fade-in-up eyebrow mb-6">
              ACT Licence #{BUSINESS.licence} · Licensed &amp; Insured
            </span>

            <h1 className="animate-fade-in-up animate-delay-100 text-4xl sm:text-5xl lg:text-7xl mb-6">
              Powering Your Home
              <br />
              <span className="text-accent">&amp; Business with Confidence</span>
            </h1>

            <p className="animate-fade-in-up animate-delay-200 text-base sm:text-lg text-body-muted max-w-xl mb-9 leading-relaxed">
              Solar panels, battery storage, EV chargers &amp; complete electrical services. Serving Canberra, ACT
              &amp; surrounding regions with quality workmanship and zero shortcuts.
            </p>

            <div className="animate-fade-in-up animate-delay-400 flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <Link href="/quote" className="btn-primary !py-3.5 !px-8 text-base">
                Get a Free Quote
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <ul className="animate-fade-in-up animate-delay-400 flex flex-wrap gap-x-6 gap-y-3 text-body-muted text-xs sm:text-sm">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange" /> ACT Licence #{BUSINESS.licence}
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange" /> Licensed &amp; Insured
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange" /> Master Electricians Australia
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange" /> Free quotes &amp; consultations
              </li>
            </ul>
          </div>

          {/* Right: Interactive Sliding Image Showcase */}
          <div className="lg:col-span-5">
            <HeroSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
