import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sun,
  BatteryCharging,
  Wrench,
  Clock,
} from "lucide-react";
import { SERVICE_AREAS, BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";
import ServiceCTA from "@/components/services/service-cta";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = SERVICE_AREAS.find((a) => a.slug === slug);
  if (!area) return { title: "Service Area Not Found" };

  return {
    title: `Licensed Electrician ${area.name} | St George Electrical`,
    description: `Professional electrical contractor in ${area.name} (${area.region}). Solar panel installation, battery storage, EV chargers, and switchboard upgrades. Call 0450 598 628.`,
  };
}

export default async function ServiceAreaPage({ params }: Props) {
  const { slug } = await params;
  const area = SERVICE_AREAS.find((a) => a.slug === slug);

  if (!area) {
    notFound();
  }

  // Schema for LocalBusiness covering this area
  const areaSchema = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: `${BUSINESS.name} - ${area.name}`,
    telephone: BUSINESS.phoneDisplay,
    email: BUSINESS.email,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${area.name}, ${area.region}`,
    },
    url: `https://stgeorgeelectrical.com.au/areas/${slug}`,
  };

  return (
    <div className="bg-off-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaSchema) }}
      />

      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-20 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs text-white/80 font-medium mb-4">
              <MapPin size={14} className="text-green-light" />
              <span>
                Servicing {area.name} &amp; Surrounding {area.region} Suburbs
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl text-white font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Licensed Electrician in {area.name}
            </h1>

            <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
              Looking for a reliable, licensed electrical contractor in {area.name}? Justin George provides prompt, high-quality solar, battery storage, EV charger, and general electrical services backed by full warranties.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href={`/quote?suburb=${encodeURIComponent(area.name)}`}
                className="btn-primary text-base !py-3.5 !px-8"
              >
                Request Free Quote in {area.name} <ArrowRight size={18} />
              </Link>
              <a
                href={phoneHref(BUSINESS.phone)}
                className="btn-outline text-base !py-3.5 !px-7"
              >
                <Phone size={18} /> Call {BUSINESS.phoneDisplay}
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
              <span>✓ ACT Licence #{BUSINESS.licence}</span>
              <span>✓ Master Electricians Australia Member</span>
              <span>✓ No Call-Out Fee for Scheduled Quotes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2
                  className="text-2xl sm:text-3xl text-navy font-bold mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Electrical Solutions Tailored for {area.name} Properties
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  Whether you reside in an established residential home, a new townhouse development, or operate a commercial facility in {area.name}, electrical demands are higher than ever. With increasing power prices and the shift toward electric vehicles, our comprehensive solutions help you save money and maintain safe, compliant power.
                </p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  We handle everything from upgrading outdated ceramic switchboards to designing high-efficiency solar and home battery storage systems eligible for government incentives.
                </p>
              </div>

              {/* Service Capabilities in this Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card bg-white p-5">
                  <Sun size={24} className="text-green mb-3" />
                  <h3 className="font-bold text-navy text-base mb-1.5">Solar &amp; Batteries</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    High-yield rooftop solar arrays and home battery storage tailored for {area.name}&apos;s climate.
                  </p>
                  <Link
                    href="/solar-battery"
                    className="text-xs font-semibold text-green hover:underline inline-flex items-center gap-1"
                  >
                    Solar Details <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="card bg-white p-5">
                  <BatteryCharging size={24} className="text-green mb-3" />
                  <h3 className="font-bold text-navy text-base mb-1.5">EV Charging</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Fast Level 2 home and workplace electric vehicle charger supply and licensed installation.
                  </p>
                  <Link
                    href="/ev-chargers"
                    className="text-xs font-semibold text-green hover:underline inline-flex items-center gap-1"
                  >
                    EV Details <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="card bg-white p-5">
                  <Wrench size={24} className="text-green mb-3" />
                  <h3 className="font-bold text-navy text-base mb-1.5">Switchboards</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Modern RCBO combination safety switches, surge protection, and compliant rewiring.
                  </p>
                  <Link
                    href="/electrical"
                    className="text-xs font-semibold text-green hover:underline inline-flex items-center gap-1"
                  >
                    Electrical Details <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Local Booking Box */}
            <div className="lg:col-span-4 bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <span className="text-xs font-bold text-green-light uppercase tracking-wider block mb-2">
                Fast Local Service
              </span>
              <h3
                className="text-2xl text-white font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book in {area.name}
              </h3>
              <p className="text-xs text-white/70 mb-6 leading-relaxed">
                Contact Justin George directly for prompt scheduling in {area.name} and surrounding {area.region} areas.
              </p>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/quote?suburb=${encodeURIComponent(area.name)}`}
                  className="btn-primary w-full !py-3 text-sm justify-center flex"
                >
                  Request a Free Quote <ArrowRight size={15} />
                </Link>
                <Link
                  href="/booking"
                  className="btn-outline w-full !py-3 text-sm justify-center flex"
                >
                  Schedule Service Visit
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-white/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-green" />
                  <span>Mon – Fri: 7:00 AM – 5:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green" />
                  <span>Emergency dispatch available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <ServiceCTA
        title={`Looking for an Electrician in ${area.name}?`}
        subtitle="Speak directly with Justin George on 0450 598 628 for honest advice and upfront pricing."
        primaryCtaText={`Get Quote in ${area.name}`}
        primaryCtaHref={`/quote?suburb=${encodeURIComponent(area.name)}`}
      />
    </div>
  );
}
