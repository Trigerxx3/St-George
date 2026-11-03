import type { Metadata } from "next";
import ServiceHero from "@/components/services/service-hero";
import ServiceFeatures, { FeatureItem } from "@/components/services/service-features";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";
import RelatedServices from "@/components/services/related-services";

export const metadata: Metadata = {
  title: "Air Conditioning & Climate Control Canberra | Heating & Cooling St George",
  description:
    "Split system and ducted air conditioning, heating and cooling installation, system upgrades, and energy-efficient climate control across Canberra & ACT. Call 0450 598 628.",
  keywords: [
    "air conditioning Canberra",
    "split system installation Canberra",
    "ducted air conditioning ACT",
    "heating and cooling Canberra",
    "climate control electrician Canberra",
    "St George Electrical",
  ],
};

const FEATURES: FeatureItem[] = [
  {
    title: "Split System Air Conditioning",
    description:
      "Supply and licensed electrical installation of high-efficiency reverse-cycle wall split systems for targeted room comfort through Canberra's freezing winters and hot summers.",
    badge: "Reverse-Cycle Comfort",
    bullets: [
      "Single-room and multi-head split system installations",
      "Dedicated circuit wiring with weatherproof outdoor isolator",
      "Whisper-quiet inverter compressor technology",
      "Wi-Fi smart control integration available",
    ],
  },
  {
    title: "Ducted Air Conditioning",
    description:
      "Whole-home and commercial ducted reverse-cycle air conditioning designed for even airflow, zoned room control, and discreet ceiling vents.",
    badge: "Whole-Home Zoning",
    bullets: [
      "Custom zone design to heat or cool only occupied rooms",
      "Single-phase and three-phase power supply upgrades",
      "Smart wall controllers and smartphone app scheduling",
      "Seamless ceiling integration for new builds and retrofits",
    ],
  },
  {
    title: "Heating & Cooling System Installation",
    description:
      "Transition away from expensive gas heating or outdated electric heaters to modern energy-efficient heat pump and reverse-cycle climate systems.",
    badge: "All-Season Climate",
    bullets: [
      "Sub-zero winter heating performance suited to ACT frosts",
      "High-capacity summer cooling and dehumidification",
      "Compliant electrical circuit protection (RCBOs)",
      "Neat conduit routing and outdoor condenser mounting",
    ],
  },
  {
    title: "System Upgrades & Replacements",
    description:
      "Replace aging, noisy, or inefficient air conditioners and evaporative units with modern inverter systems that dramatically cut running costs.",
    badge: "Modernise & Save",
    bullets: [
      "Safe decommissioning of older units and electrical circuits",
      "Switchboard load assessment and circuit upgrades",
      "Gas-to-electric heating conversion support",
      "Improved energy star ratings and lower power bills",
    ],
  },
  {
    title: "Air Conditioning Maintenance",
    description:
      "Keep your climate control systems running at peak efficiency and extend equipment lifespan with routine electrical and system checks.",
    badge: "Peak Reliability",
    bullets: [
      "Electrical terminal, isolator, and current-draw testing",
      "Filter, coil, and airflow performance inspections",
      "Pre-winter and pre-summer preventative servicing",
      "Fault diagnostics and prompt repair support",
    ],
  },
  {
    title: "Energy-Efficient Climate Solutions",
    description:
      "Pair your reverse-cycle heating and cooling with rooftop solar and battery storage so you can heat and cool your property using your own clean energy.",
    badge: "Solar-Ready Climate",
    bullets: [
      "Pre-heat or pre-cool your home during peak daytime solar",
      "Eligible under ACT electrification and energy-efficiency schemes",
      "Smart timer and automation setup for off-peak tariffs",
      "Lower carbon footprint and reduced quarterly power bills",
    ],
  },
];

const FAQS: FAQItem[] = [
  {
    question: "Does my air conditioner need a dedicated electrical circuit?",
    answer:
      "Yes. Australian standards require reverse-cycle air conditioning systems to be wired on a dedicated circuit protected by an RCBO safety switch and a lockable weatherproof isolator switch beside the outdoor condenser unit.",
  },
  {
    question: "Should I choose a split system or ducted air conditioning?",
    answer:
      "Split systems are ideal and cost-effective for heating and cooling 1 to 3 specific rooms or open living areas. Ducted air conditioning is best when you want whole-home climate control across multiple bedrooms and living zones from a single central system.",
  },
  {
    question: "Can my reverse-cycle system run off my solar panels?",
    answer:
      "Absolutely. Running your reverse-cycle air conditioner during the day to pre-heat in winter or pre-cool in summer uses excess rooftop solar generation directly, drastically reducing grid power usage.",
  },
  {
    question: "Do you handle upgrades from old gas heating to electric reverse-cycle?",
    answer:
      "Yes. Many Canberra homeowners are replacing costly ducted gas heaters with high-efficiency reverse-cycle air conditioning. We assess your switchboard capacity, upgrade circuits if needed, and complete the full installation.",
  },
];

export default function HeatingCoolingPage() {
  return (
    <>
      <ServiceHero
        title="Air Conditioning & Climate Control"
        tagline="Division 04 — Heating & Cooling"
        description="Complete split system and ducted air conditioning, heating and cooling installations, system upgrades, and energy-efficient climate solutions across Canberra & surrounding regions."
        primaryCtaText="Get a Free Quote"
        primaryCtaHref="/quote?service=heating-cooling"
        imageSrc="/images/hero/hero-solar-home.jpg"
        imageAlt="Energy-efficient air conditioning and climate control for Canberra homes"
      />

      <ServiceFeatures
        title="Complete Heating & Cooling Capabilities"
        subtitle="Tailored climate control systems engineered for Canberra's winter frosts and summer heat."
        features={FEATURES}
      />

      <ServiceCTA
        title="Ready for Year-Round Comfort?"
        subtitle="Speak directly with St George Electrical for an obligation-free quote on split system or ducted air conditioning."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/quote?service=heating-cooling"
      />

      <RelatedServices currentSlug="heating-cooling" />
    </>
  );
}

