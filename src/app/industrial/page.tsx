import type { Metadata } from "next";
import Link from "next/link";
import { Factory, Zap, ShieldCheck, Gauge, AlertTriangle, Cpu, ArrowRight } from "lucide-react";
import ServiceHero from "@/components/services/service-hero";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";

export const metadata: Metadata = {
  title: "Industrial Electrical Contracting Canberra | St George Electrical",
  description:
    "Heavy-duty industrial electrical contracting in Canberra, ACT & surrounding regions. Machinery wiring, industrial distribution, motor control, safety interlocks. Call 0450 598 628.",
};

const INDUSTRIAL_CAPABILITIES = [
  {
    icon: Gauge,
    title: "Machinery Wiring & Power Feeds",
    desc: "Dedicated power supplies and connection of manufacturing machinery, heavy equipment, air compressors, and industrial plant.",
    href: "/electrical",
  },
  {
    icon: Zap,
    title: "Industrial Distribution Boards",
    desc: "High-capacity main switchboards, sub-distribution centres, and busbar trunking built to withstand harsh industrial environments.",
    href: "/electrical",
  },
  {
    icon: AlertTriangle,
    title: "Safety Systems & Emergency Stops",
    desc: "Machine guarding interlocks, emergency stop loops (E-stops), and Category 4 safety circuits to safeguard operational personnel.",
    href: "/electrical",
  },
  {
    icon: Cpu,
    title: "Motor Controls & Variable Speed Drives",
    desc: "Installation, commissioning, and troubleshooting of VSDs, soft starters, contactors, and automated relay control panels.",
    href: "/electrical",
  },
  {
    icon: ShieldCheck,
    title: "Thermal Imaging & Diagnostic Audits",
    desc: "FLIR thermal imaging scans to detect hot spots, loose terminations, and imminent equipment failures before costly breakdowns occur.",
    href: "/electrical",
  },
  {
    icon: Factory,
    title: "Warehouse High-Bay LED Lighting",
    desc: "Energy-efficient industrial high-bay lighting with intelligent daylight harvesting and motion sensors for expansive warehouse footprints.",
    href: "/electrical",
  },
];

const INDUSTRIAL_FAQS: FAQItem[] = [
  {
    question: "Do you have experience with heavy machinery three-phase connections?",
    answer: "Yes, we specialize in high-amperage 415V three-phase installations, sub-main sizing, power factor correction, and machine terminal connections.",
  },
  {
    question: "What safety protocols do you adhere to on industrial sites?",
    answer: "We follow strict WHS standards including site-specific Safe Work Method Statements (SWMS), lockout/tagout (LOTO) procedures, and full PPE compliance.",
  },
  {
    question: "Do you service regional industrial sites outside the immediate Canberra area?",
    answer: "Yes, we service industrial clients throughout the ACT as well as regional NSW industrial hubs including Queanbeyan, Hume, Goulburn, and Yass.",
  },
];

export default function IndustrialSectorPage() {
  return (
    <>
      <ServiceHero
        title="Industrial Electrical Contracting"
        tagline="Reliable electrical solutions for large-scale operations."
        description="Heavy-duty electrical engineering for industrial plants, manufacturing facilities, warehouses, and transport depots across Canberra and regional NSW."
        primaryCtaText="Request Industrial Assessment"
        primaryCtaHref="/quote?property=industrial"
        imageSrc="/images/services/commercial-solar.jpg"
        imageAlt="Industrial electrical and high-voltage distribution Canberra"
      />

      <section className="section-padding bg-off-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-primary mb-3">Heavy Industry</span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Industrial Electrical Capabilities
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              High-amperage engineering, machinery connections, and certified plant safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIAL_CAPABILITIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card hover:shadow-lg transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <h3
                      className="text-xl font-bold text-navy mb-2 group-hover:text-green transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-green pt-3 border-t border-gray-100"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSteps
        title="Industrial Project Workflow"
        subtitle="Safety-first approach with documented compliance at every milestone."
      />

      <ServiceFAQ title="Industrial Operations FAQs" faqs={INDUSTRIAL_FAQS} />

      <ServiceCTA
        title="Require Industrial Electrical Contracting?"
        subtitle="Contact Justin George to discuss your plant requirements, power capacities, and shutdown schedules."
        primaryCtaText="Request Consultation"
        primaryCtaHref="/quote?property=industrial"
      />
    </>
  );
}
