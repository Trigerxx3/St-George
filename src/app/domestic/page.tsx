import type { Metadata } from "next";
import Link from "next/link";
import { Home, Shield, Zap, Sun, BatteryCharging, Wrench, CheckCircle, ArrowRight } from "lucide-react";
import ServiceHero from "@/components/services/service-hero";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";

export const metadata: Metadata = {
  title: "Domestic Electrical Services Canberra | St George Electrical",
  description:
    "Trusted residential electrical services in Canberra & ACT. Home solar, battery storage, EV chargers, switchboards, lighting, and rewiring. Call 0450 598 628.",
};

const RESIDENTIAL_SERVICES = [
  {
    icon: Sun,
    title: "Home Solar & Battery Systems",
    desc: "Cut your household energy bills with high-efficiency rooftop solar arrays and home battery storage solutions.",
    href: "/solar-battery",
  },
  {
    icon: BatteryCharging,
    title: "Home EV Charger Installation",
    desc: "Fast, safe Level 2 charging installed in your garage or driveway. Compatible with all EV models.",
    href: "/ev-chargers",
  },
  {
    icon: Shield,
    title: "Switchboard & Safety Upgrades",
    desc: "Modern RCBO safety switches to protect your family from electrocution and electrical fires.",
    href: "/electrical",
  },
  {
    icon: Zap,
    title: "LED Lighting & Power Points",
    desc: "Energy-efficient downlights, outdoor security lighting, and extra power outlets with USB charging.",
    href: "/electrical",
  },
  {
    icon: Wrench,
    title: "Home Renovations & Rewiring",
    desc: "Complete electrical rough-in and fit-out for kitchen, bathroom, and full-home renovations.",
    href: "/electrical",
  },
  {
    icon: CheckCircle,
    title: "Smoke Alarms & Safety Audits",
    desc: "Photoelectric interconnected smoke alarms compliant with ACT legislation, plus landlord safety certificates.",
    href: "/electrical",
  },
];

const DOMESTIC_FAQS: FAQItem[] = [
  {
    question: "Do you offer free quotes for Canberra homeowners?",
    answer: "Yes, we provide 100% free, obligation-free assessments and upfront quotes for residential solar, battery, EV charging, and electrical projects.",
  },
  {
    question: "How quickly can you attend to residential electrical jobs?",
    answer: "We offer flexible scheduling throughout the week and can accommodate urgent repairs across Canberra, Queanbeyan, and surrounding ACT regions.",
  },
  {
    question: "Are your electricians fully licensed and insured in the ACT?",
    answer: "Yes, Justin George holds ACT Electrical Contractor Licence #2028729, full public liability insurance, and Master Electricians membership.",
  },
];

export default function DomesticSectorPage() {
  return (
    <>
      <ServiceHero
        title="Domestic Electrical & Energy Solutions"
        tagline="Keeping your home safe, comfortable & powered."
        description="Expert residential electrical services tailored for Canberra homes. From rooftop solar and EV charging to safety upgrades and home renovations."
        primaryCtaText="Request Home Quote"
        primaryCtaHref="/quote?property=house"
        imageSrc="/images/hero/hero-solar-home.jpg"
        imageAlt="Modern residential solar home in Canberra"
      />

      <section className="section-padding bg-off-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-primary mb-3">Residential Solutions</span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Complete Home Electrical Care
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Reliable, clean, and respectful workmanship for you and your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESIDENTIAL_SERVICES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card hover:shadow-lg transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-green/10 text-green flex items-center justify-center mb-4 group-hover:bg-green group-hover:text-white transition-colors">
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
                    <span>View details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSteps
        title="Our Residential Service Experience"
        subtitle="Prompt, polite, and tidy — treating your home with utmost care."
      />

      <ServiceFAQ title="Homeowner FAQs" faqs={DOMESTIC_FAQS} />

      <ServiceCTA
        title="Need Residential Electrical Assistance?"
        subtitle="Get in touch with Justin George for expert advice and quick service."
        primaryCtaText="Get a Free Home Quote"
        primaryCtaHref="/quote?property=house"
      />
    </>
  );
}
