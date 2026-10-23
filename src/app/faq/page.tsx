import type { Metadata } from "next";
import Link from "next/link";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import { HelpCircle, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | St George Electrical Canberra",
  description:
    "Common questions and answers regarding solar panel installation, home batteries, EV chargers, switchboard upgrades, and ACT rebates in Canberra.",
};

const ALL_FAQS: FAQItem[] = [
  {
    question: "Are your solar and electrical installations eligible for the ACT Sustainable Household Scheme?",
    answer:
      "Yes. St George Electrical Energy Solutions complies with all ACT Government requirements under the Sustainable Household Scheme. Eligible Canberra homeowners can access up to $15,000 in zero-interest loans over terms of 2 to 10 years to finance rooftop solar, home battery storage, and smart EV charger installations.",
  },
  {
    question: "Do you provide free on-site quotes in Canberra?",
    answer:
      "Yes, we provide 100% free, obligation-free site assessments and quotations across all Canberra suburbs, Queanbeyan, and surrounding regional areas. We review your roof orientation, shading, switchboard capacity, and electricity bills to design a tailored proposal.",
  },
  {
    question: "How long does a home solar and battery installation take?",
    answer:
      "A standard residential rooftop solar installation (6.6kW to 10kW) is typically completed within a single day. Adding a home battery storage system such as a Tesla Powerwall or Sungrow battery generally takes 1 to 2 days including full backup circuit configuration and commissioning.",
  },
  {
    question: "Do I need to upgrade my electrical switchboard to install an EV charger?",
    answer:
      "Not always. A standard Level 2 EV charger requires a continuous 32-amp circuit. If your switchboard has modern RCBO safety switches and adequate spare capacity, we can install directly. If your property still has old ceramic fuses or an outdated asbestos backing panel, a switchboard safety upgrade will be required to comply with AS/NZS 3000.",
  },
  {
    question: "Can I charge my electric vehicle directly using solar power?",
    answer:
      "Yes! With a solar-aware charger such as the Myenergi Zappi or Fronius Wattpilot, the charger monitors your rooftop solar production in real time. It automatically channels excess daytime solar generation straight into your EV battery, meaning you can commute completely fuel-free without buying power from the grid.",
  },
  {
    question: "What warranties are included on your installations?",
    answer:
      "All installations feature comprehensive warranties: 25-year performance warranties on Tier-1 N-Type solar panels, 10 to 12 years on solar inverters, 10 years on lithium battery systems, 3 to 4 years on EV chargers, and our direct 10-year St George Electrical workmanship guarantee.",
  },
  {
    question: "Do you supply official ACT Certificates of Electrical Compliance?",
    answer:
      "Yes. Justin George holds ACT Electrical Contractor Licence #2028729. Every notifiable electrical installation is thoroughly tested to Australian Standards (AS/NZS 3000) and an official Certificate of Electrical Compliance is lodged with Access Canberra.",
  },
  {
    question: "What happens during a power blackout if I have solar and a battery?",
    answer:
      "If you have an emergency backup battery system (such as the Tesla Powerwall 3 or Sungrow hybrid EPS), the system automatically disconnects from the grid in less than 20 milliseconds during a blackout and continues powering your essential home circuits (lights, refrigeration, Wi-Fi, heating/cooling). Standard solar-only systems shut down during blackouts for safety reasons unless equipped with emergency backup.",
  },
  {
    question: "How do interconnected smoke alarms work under ACT tenancy rules?",
    answer:
      "Under ACT building and residential tenancy legislation, smoke alarms must be photoelectric, mains-powered (240V) with battery backup, and interconnected. When any alarm in the house detects smoke, all alarms throughout the property sound simultaneously, giving occupants maximum warning time.",
  },
  {
    question: "Who will actually perform the electrical work on my property?",
    answer:
      "Unlike large solar sales marketing companies that outsource installations to random subcontractors, Justin George personally manages and carries out the work. You deal directly with your licensed electrician from initial quote to final inspection.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <HelpCircle size={14} />
            Expert Answers to Common Electrical &amp; Solar Questions
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Find clear, transparent information about solar panels, batteries, EV chargers, switchboards, and government rebates in Canberra.
          </p>
        </div>

        {/* Accordion FAQ with Schema */}
        <ServiceFAQ
          title="All Common Questions & Answers"
          subtitle="Click on any question to view detailed advice from Justin George."
          faqs={ALL_FAQS}
        />

        {/* Still have questions card */}
        <div className="mt-14 bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-2xl mx-auto shadow-sm">
          <h3
            className="text-2xl text-navy font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Have a Specific Question About Your Property?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Justin George is always happy to discuss your electrical layout, switchboard capacity, or solar payback timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary !py-2.5 !px-6 text-sm">
              Send a Message <ArrowRight size={14} />
            </Link>
            <a href={phoneHref(BUSINESS.phone)} className="btn-outline !py-2.5 !px-6 text-sm">
              <Phone size={14} /> Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
