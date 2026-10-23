import type { Metadata } from "next";
import ServiceHero from "@/components/services/service-hero";
import ServiceFeatures, { FeatureItem } from "@/components/services/service-features";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";
import RelatedServices from "@/components/services/related-services";

export const metadata: Metadata = {
  title: "Solar & Battery Installation Canberra | St George Electrical",
  description:
    "Expert solar panel and battery storage installations across Canberra and the ACT. ACT Sustainable Household Scheme eligible. Contact Justin George on 0450 598 628.",
  keywords: [
    "solar panels Canberra",
    "solar battery ACT",
    "home battery storage Canberra",
    "solar installer Canberra",
    "ACT Sustainable Household Scheme",
    "St George Electrical",
  ],
};

const FEATURES: FeatureItem[] = [
  {
    title: "Residential Solar Systems",
    description:
      "Custom-designed rooftop solar arrays for Canberra homes. We use Tier-1 high-efficiency panels optimized for Canberra's winter sun angles and summer heat.",
    badge: "5kW – 15kW Systems",
    bullets: [
      "Tier-1 N-Type TOPCon panels (25-year warranty)",
      "High-efficiency smart string and micro-inverters",
      "Tailored roof layout for maximum solar yield",
      "Clean Energy Council compliant installation",
    ],
  },
  {
    title: "Home Battery Storage",
    description:
      "Store your excess daytime solar power to power your home through the evening peak rates and keep your essential circuits running during blackout events.",
    badge: "Blackout Protection",
    bullets: [
      "Compatible with Sungrow, Tesla, Enphase & BYD",
      "Emergency Power Supply (EPS) backup circuits",
      "Smart time-of-use tariff shifting for extra savings",
      "10-year manufacturer warranty",
    ],
  },
  {
    title: "Commercial Solar Solutions",
    description:
      "Slash commercial operational overheads with commercial-grade rooftop solar arrays. Designed to offset daytime peak commercial tariffs.",
    badge: "Commercial 15kW – 100kW+",
    bullets: [
      "Three-phase commercial solar engineering",
      "Network connection & EvoEnergy application handling",
      "Substantial tax depreciation and STC incentives",
      "Comprehensive structural and electrical design",
    ],
  },
  {
    title: "System Health Check & Maintenance",
    description:
      "Is your existing system underperforming or showing inverter error codes? We provide thorough diagnostic testing, isolator safety upgrades, and maintenance.",
    badge: "Repairs & Audit",
    bullets: [
      "Inverter fault diagnosis & warranty replacement",
      "DC isolator safety inspections and replacements",
      "Performance degradation and shading analysis",
      "String voltage and earth leakage testing",
    ],
  },
  {
    title: "Solar Monitoring & Smart Energy",
    description:
      "Track your energy generation, self-consumption, and grid exports in real time from your smartphone. Maximize your self-consumption efficiency.",
    badge: "Mobile App Included",
    bullets: [
      "Live power flow visualization on iOS & Android",
      "Consumption metering hardware installed",
      "Automated fault alerts and performance notifications",
      "Export limiting compliance with ACT network rules",
    ],
  },
  {
    title: "Rebate & Government Incentive Support",
    description:
      "We handle the paperwork for Federal STC rebates and help guide you through the ACT Sustainable Household Scheme for zero-interest financing.",
    badge: "ACT Scheme Eligible",
    bullets: [
      "Point-of-sale STC discount applied directly",
      "Assistance with ACT government zero-interest loan scheme",
      "EvoEnergy connection approvals handled entirely",
      "Transparent breakdown of rebates on every quote",
    ],
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How much can I save on power bills in Canberra with solar?",
    answer:
      "Canberra receives over 2,800 hours of sunshine annually. A typical 6.6kW solar system can save an average Canberra household between $1,200 and $2,200 annually, depending on your energy usage patterns, roof orientation, and whether you add a battery storage system.",
  },
  {
    question: "Are your installations eligible for the ACT Sustainable Household Scheme?",
    answer:
      "Yes. St George Electrical Energy Solutions complies with all ACT Government quality, safety, and installer certification requirements under the ACT Sustainable Household Scheme, allowing eligible homeowners to access up to $15,000 in zero-interest loans.",
  },
  {
    question: "Do I need a battery with my solar system?",
    answer:
      "While a solar-only system delivers excellent return on investment, a battery allows you to store daytime surplus solar and avoid buying expensive peak electricity from 5 PM to 10 PM. A battery also provides emergency power during grid outages.",
  },
  {
    question: "How long does a standard solar installation take?",
    answer:
      "Most residential installations (6.6kW to 10kW) are completed in a single day by our licensed electrical team. We schedule the EvoEnergy meter reconfiguration and final inspection immediately following installation.",
  },
  {
    question: "What warranties are included with St George Electrical installations?",
    answer:
      "All systems we install feature 25-year panel performance warranties, 10 to 12-year inverter warranties, 10-year battery warranties, and our comprehensive 10-year workmanship guarantee.",
  },
];

export default function SolarBatteryPage() {
  return (
    <>
      <ServiceHero
        title="Solar & Battery Solutions Canberra"
        tagline="Smart. Sustainable. Reliable."
        description="High-performance solar panel and battery storage installations engineered for Canberra's climate. Cut energy bills, achieve energy independence, and claim available government rebates."
        primaryCtaText="Get a Free Solar Quote"
        primaryCtaHref="/quote?service=solar-battery"
      />

      <ServiceFeatures
        title="Engineered for Maximum Efficiency & Durability"
        subtitle="Every system is designed by Justin George to maximize solar generation through Canberra's cold winters and hot summers."
        features={FEATURES}
      />

      <ProcessSteps
        title="From Solar Design to Clean Energy Generation"
        subtitle="A hassle-free 4-step installation managed entirely by licensed ACT electricians."
      />

      <ServiceFAQ
        title="Frequently Asked Questions: Solar & Batteries"
        faqs={FAQS}
      />

      <ServiceCTA
        title="Ready to Cut Your Electricity Bills?"
        subtitle="Contact Justin George for a detailed solar & battery assessment with no sales pressure."
        primaryCtaText="Request Solar Quote"
        primaryCtaHref="/quote?service=solar-battery"
      />

      <RelatedServices currentSlug="solar-battery" />
    </>
  );
}
