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
      <section className="section-dark pt-24 pb-16 lg:pt-32 lg:pb-24 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4">
              Servicing {area.name} &amp; Surrounding {area.region} Suburbs
            </span>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="block">Licensed Electrician</span>
              <span className="block text-orange-light">in {area.name}</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Looking for a reliable, licensed electrical contractor in {area.name}? {BUSINESS.name} provides prompt, high-quality solar, battery storage, EV charger, and general electrical services backed by full warranties.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href={`/quote?suburb=${encodeURIComponent(area.name)}`}
                className="btn-primary text-base !py-3.5 !px-8"
              >
                Request Free Quote in {area.name} <span aria-hidden="true">↗</span>
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
      <section className="section-light section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2
                  className="text-2xl sm:text-3xl text-ink font-bold mb-4"
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
                  <Sun size={24} className="text-orange-strong mb-3" />
                  <h3 className="font-bold text-ink text-base mb-1.5">Solar &amp; Batteries</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    High-yield rooftop solar arrays and home battery storage tailored for {area.name}&apos;s climate.
                  </p>
                  <Link
                    href="/solar-battery"
                    className="link-arrow text-xs"
                  >
                    Solar Details <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <div className="card bg-white p-5">
                  <BatteryCharging size={24} className="text-orange-strong mb-3" />
                  <h3 className="font-bold text-ink text-base mb-1.5">EV Charging</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Fast Level 2 home and workplace electric vehicle charger supply and licensed installation.
                  </p>
                  <Link
                    href="/ev-chargers"
                    className="link-arrow text-xs"
                  >
                    EV Details <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <div className="card bg-white p-5">
                  <Wrench size={24} className="text-orange-strong mb-3" />
                  <h3 className="font-bold text-ink text-base mb-1.5">Switchboards</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Modern RCBO combination safety switches, surge protection, and compliant rewiring.
                  </p>
                  <Link
                    href="/electrical"
                    className="link-arrow text-xs"
                  >
                    Electrical Details <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Local Booking Box */}
            <div className="lg:col-span-4 section-dark text-white p-6 sm:p-8 rounded-2xl shadow-2xl border-0">
              <div className="relative z-10">
                <span className="eyebrow mb-2">
                  Fast Local Service
                </span>
                <h3
                  className="text-2xl text-white font-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Book in {area.name}
                </h3>
                <p className="text-xs text-white/70 mb-6 leading-relaxed">
                  Contact {BUSINESS.shortName} directly for prompt scheduling in {area.name} and surrounding {area.region} areas.
                </p>

                <div className="space-y-3 mb-6">
                  <Link
                    href={`/quote?suburb=${encodeURIComponent(area.name)}`}
                    className="btn-primary w-full !py-3 text-sm justify-center flex"
                  >
                    Request a Free Quote <span aria-hidden="true">↗</span>
                  </Link>
                  <Link
                    href="/booking"
                    className="btn-outline w-full !py-3 text-sm justify-center flex"
                  >
                    Schedule Service Visit
                  </Link>
                </div>

                <div className="pt-4 border-t-0 text-xs text-white/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-orange-light" />
                    <span>Mon – Fri: 7:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-orange-light" />
                    <span>Emergency dispatch available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <ServiceCTA
        title={`Looking for an Electrician in ${area.name}?`}
        subtitle="Call 0450 598 628 for honest advice and upfront pricing."
        primaryCtaText={`Get Quote in ${area.name}`}
        primaryCtaHref={`/quote?suburb=${encodeURIComponent(area.name)}`}
      />
    </div>
  );
}
