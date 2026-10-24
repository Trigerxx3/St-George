import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";
import ServiceCTA from "@/components/services/service-cta";

export const metadata: Metadata = {
  title: "About Justin George & St George Electrical Canberra",
  description:
    "Learn about St George Electrical Energy Solutions. Founded by licensed electrician Justin George (ACT Licence #2028729). Master Electricians member.",
};

export default function AboutPage() {
  return (
    <div className="bg-off-white min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-24 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs text-white/80 font-medium mb-4">
              <ShieldCheck size={14} className="text-green-light" />
              <span>ACT Licence #{BUSINESS.licence} · Master Electricians Member</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl text-white font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Powering Canberra with Confidence &amp; Integrity
            </h1>

            <p
              className="text-2xl text-orange-light mb-6"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              {BUSINESS.tagline}
            </p>

            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
              St George Electrical Energy Solutions is an independent, owner-operated electrical contractor based in Canberra. Founded by Justin George, we deliver high-performance solar, battery storage, EV chargers, and complete electrical services with personal accountability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-primary text-base !py-3.5 !px-8">
                Request a Free Quote <ArrowRight size={18} />
              </Link>
              <a
                href={phoneHref(BUSINESS.phone)}
                className="btn-outline text-base !py-3.5 !px-7"
              >
                <Phone size={18} /> Call Justin: {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Story & Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-7 space-y-6">
              <span className="badge-primary">Our Mission</span>
              <h2
                className="text-3xl sm:text-4xl text-navy font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Direct Electrician Service With No Subcontractor Gambles
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                In today&apos;s solar and electrical market, too many homeowners deal with aggressive sales call centres that outsource installation work to low-bid third-party subcontractors. At St George Electrical, we do things differently.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                When you contact St George Electrical, you deal directly with Justin George. From the initial roof assessment and switchboard calculation to the final commissioning and certificate sign-off, our reputation is built on delivering tidy, compliant, and durable workmanship.
              </p>

              <div className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-navy">Master Electricians Australia Member</h3>
                    <p className="text-xs text-gray-500">
                      Adhering to strict industry safety audits, safety management systems, and ethical code of conduct.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-navy">Clean Energy Council Certified</h3>
                    <p className="text-xs text-gray-500">
                      Certified for residential and commercial solar and battery storage design and grid installation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-navy">ACT Government Scheme Participant</h3>
                    <p className="text-xs text-gray-500">
                      Accredited for zero-interest financing under the ACT Sustainable Household Scheme.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Credentials Box & Installation Showcase */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-navy group">
                <img
                  src="/images/services/battery-storage.jpg"
                  alt="Justin George installation quality - St George Electrical"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent flex items-end p-5">
                  <span className="text-xs font-semibold text-white bg-green/90 px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                    Canberra Solar &amp; Battery Specialists
                  </span>
                </div>
              </div>

              <div className="bg-navy text-white rounded-2xl p-8 shadow-xl space-y-6">
                <h3
                  className="text-2xl text-white font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                Contractor Credentials
              </h3>

              <div className="space-y-4 text-sm divide-y divide-white/10">
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">Business Name:</span>
                  <span className="font-semibold text-white">{BUSINESS.name}</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">Owner &amp; Lead Electrician:</span>
                  <span className="font-semibold text-white">{BUSINESS.owner}</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">ACT Electrical Licence:</span>
                  <span className="font-semibold text-green-light font-mono">#{BUSINESS.licence}</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">Direct Phone:</span>
                  <span className="font-semibold text-white">{BUSINESS.phoneDisplay}</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">Insurance:</span>
                  <span className="font-semibold text-white">Full Public Liability &amp; Workers Comp</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-white/60">Headquarters:</span>
                  <span className="font-semibold text-white">Canberra, ACT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      <ServiceCTA />
    </div>
  );
}
