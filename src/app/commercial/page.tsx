import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Sun, BatteryCharging, Zap, ShieldAlert, Cpu, ArrowRight } from "lucide-react";
import ServiceHero from "@/components/services/service-hero";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";

export const metadata: Metadata = {
  title: "Commercial Electrician Canberra | St George Electrical",
  description:
    "Commercial electrical contracting across Canberra & ACT. Commercial solar, office fitouts, 3-phase power, test & tag, scheduled maintenance. Call 0450 598 628.",
};

const COMMERCIAL_CAPABILITIES = [
  {
    icon: Sun,
    title: "Commercial Solar & Peak Shaving",
    desc: "15kW to 100kW+ commercial PV arrays engineered to minimize daytime operational grid charges.",
    href: "/solar-battery",
  },
  {
    icon: BatteryCharging,
    title: "Commercial & Fleet EV Charging",
    desc: "Dual-socket smart EV charging stations for staff carparks, client parking, and delivery fleets.",
    href: "/ev-chargers",
  },
  {
    icon: Building2,
    title: "Office & Retail Fit-outs",
    desc: "Complete electrical and lighting fit-outs for tenancies, retail stores, medical suites, and hospitality venues.",
    href: "/electrical",
  },
  {
    icon: Zap,
    title: "Three-Phase Distribution",
    desc: "Main switchboard upgrades, sub-boards, and power reticulation for heavy commercial equipment.",
    href: "/electrical",
  },
  {
    icon: ShieldAlert,
    title: "Test & Tag and Compliance",
    desc: "Periodic safety testing of portable electrical equipment, emergency lighting tests, and logbook compliance.",
    href: "/electrical",
  },
  {
    icon: Cpu,
    title: "Scheduled Maintenance & Repairs",
    desc: "Preventative electrical maintenance contracts to prevent costly equipment downtime and ensure workplace safety.",
    href: "/electrical",
  },
];

const COMMERCIAL_FAQS: FAQItem[] = [
  {
    question: "Can you carry out commercial electrical work outside business hours?",
    answer: "Yes, we understand that commercial operations cannot afford daytime disruption. We offer scheduled out-of-hours and weekend work to fit your business schedule.",
  },
  {
    question: "Do you assist with EvoEnergy commercial connection approvals?",
    answer: "Yes, we liaise directly with EvoEnergy to submit and obtain network approvals for 3-phase power upgrades, solar grid export approvals, and high-capacity EV charging infrastructure.",
  },
  {
    question: "Can you provide ongoing facility maintenance contracts?",
    answer: "Yes, we offer scheduled preventative maintenance agreements including emergency exit light testing, RCD trip time testing, and switchboard thermal imaging audits.",
  },
];

export default function CommercialSectorPage() {
  return (
    <>
      <ServiceHero
        title="Commercial Electrical Contracting Canberra"
        tagline="Powering businesses to keep them running."
        description="Reliable electrical engineering for commercial enterprises, retail tenancies, and property managers. Minimise downtime, cut power expenses, and maintain full workplace safety compliance."
        primaryCtaText="Request Commercial Quote"
        primaryCtaHref="/quote?property=commercial"
        imageSrc="/images/services/commercial-solar.jpg"
        imageAlt="Commercial Rooftop Solar and Power Solutions Canberra"
      />

      <section className="section-padding bg-off-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge-primary mb-3">Enterprise Solutions</span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Commercial Electrical Capabilities
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Engineered for efficiency, safety, and operational reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMERCIAL_CAPABILITIES.map((item, idx) => {
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
        title="Commercial Project Management"
        subtitle="On-time delivery, clear site coordination, and rigorous safety standards."
      />

      <ServiceFAQ title="Commercial Client FAQs" faqs={COMMERCIAL_FAQS} />

      <ServiceCTA
        title="Partner With an Experienced Commercial Electrician"
        subtitle="Discuss your commercial facility, fit-out, or solar upgrade with Justin George."
        primaryCtaText="Request Commercial Quote"
        primaryCtaHref="/quote?property=commercial"
      />
    </>
  );
}
