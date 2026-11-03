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
  title: "About St George Electrical Energy Solutions | Canberra",
  description:
    "Learn about St George Electrical Energy Solutions. Licensed electrical contractor in Canberra (ACT Licence #2028729). Master Electricians member.",
};

export default function AboutPage() {
  return (
    <div className="section-light min-h-screen">
      {/* Hero */}
      <section className="section-dark pt-24 pb-16 lg:pt-32 lg:pb-24 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4">
              ACT Licence #{BUSINESS.licence} · Master Electricians Member
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
              Powering Canberra with
              <br />
              <span className="text-accent">Confidence &amp; Integrity</span>
            </h1>

            <p className="text-xl text-orange-light font-semibold italic mb-6">
              {BUSINESS.tagline}
            </p>

            <p className="text-body-muted text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
              St George Electrical Energy Solutions is an independent, locally operated electrical contractor based in Canberra. We deliver high-performance solar, battery storage, EV chargers, heating &amp; cooling, security, and complete electrical services with direct accountability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="btn-primary text-base !py-3.5 !px-8">
                Request a Free Quote <ArrowRight size={18} />
              </Link>
              <a
                href={phoneHref(BUSINESS.phone)}
                className="btn-outline text-base !py-3.5 !px-7"
              >
                <Phone size={18} /> Call {BUSINESS.phoneDisplay}
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
              <span className="eyebrow !text-orange-strong">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl text-ink">
                Direct Electrician Service With No Subcontractor Gambles
              </h2>
              <p className="text-body-muted text-base leading-relaxed">
                In today&apos;s solar and electrical market, too many homeowners deal with aggressive sales call centres that outsource installation work to low-bid third-party subcontractors. At St George Electrical, we do things differently.
              </p>
              <p className="text-body-muted text-base leading-relaxed">
                When you contact St George Electrical, you deal directly with our licensed electricians. From the initial roof assessment and switchboard calculation to the final commissioning and certificate sign-off, our reputation is built on delivering tidy, compliant, and durable workmanship.
              </p>

              <div className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-orange-strong shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-ink">Master Electricians Australia Member</h3>
                    <p className="text-xs text-gray-500">
                      Adhering to strict industry safety audits, safety management systems, and ethical code of conduct.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-orange-strong shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-ink">Clean Energy Council Certified</h3>
                    <p className="text-xs text-gray-500">
                      Certified for residential and commercial solar and battery storage design and grid installation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-orange-strong shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-ink">ACT Government Scheme Participant</h3>
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
                  alt="St George Electrical installation quality"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent flex items-end p-5">
                  <span className="text-xs font-semibold text-white bg-orange-strong px-3.5 py-1.5 rounded-full shadow-sm">
                    Canberra Solar &amp; Battery Specialists
                  </span>
                </div>
              </div>

              <div className="section-dark text-white rounded-2xl p-8 shadow-xl space-y-6">
                <h3 className="text-2xl text-white">
                  Contractor Credentials
                </h3>

                <div className="space-y-4 text-sm divide-y divide-white/10">
                  <div className="pt-3 flex justify-between">
                    <span className="text-[#9fb2c8]">Business Name:</span>
                    <span className="font-semibold text-white">{BUSINESS.name}</span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span className="text-[#9fb2c8]">ACT Electrical Licence:</span>
                    <span className="font-semibold text-orange-light font-mono">#{BUSINESS.licence}</span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span className="text-[#9fb2c8]">Direct Phone:</span>
                    <span className="font-semibold text-white">{BUSINESS.phoneDisplay}</span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span className="text-[#9fb2c8]">Insurance:</span>
                    <span className="font-semibold text-white">Full Public Liability &amp; Workers Comp</span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span className="text-[#9fb2c8]">Headquarters:</span>
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
