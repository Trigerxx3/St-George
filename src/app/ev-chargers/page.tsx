import type { Metadata } from "next";
import ServiceHero from "@/components/services/service-hero";
import ServiceFeatures, { FeatureItem } from "@/components/services/service-features";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";
import RelatedServices from "@/components/services/related-services";

export const metadata: Metadata = {
  title: "EV Charger Installation Canberra | St George Electrical",
  description:
    "Licensed EV charger installation for homes and businesses across Canberra and ACT. Tesla, Ocular, Zappi, Schneider, ABB. Fast, safe, solar-integrated. Call 0450 598 628.",
  keywords: [
    "EV charger installation Canberra",
    "electric vehicle charger Canberra",
    "Tesla wall connector installation Canberra",
    "home EV charger ACT",
    "commercial EV charging stations",
    "solar EV charger",
  ],
};

const FEATURES: FeatureItem[] = [
  {
    title: "Home EV Charger Installation",
    description:
      "Charge up to 8x faster than a regular 10A wall socket. We install dedicated 32A circuits with safety RCDs and weather-resistant wall connectors.",
    badge: "7.4kW – 22kW Fast Charging",
    bullets: [
      "Level 2 high-speed overnight charging",
      "Indoor garage & outdoor weatherproof mounting",
      "Dedicated Type B RCD protection for safety",
      "Certified for Tesla, BYD, Hyundai, Polestar & all EVs",
    ],
  },
  {
    title: "Solar-Integrated EV Charging",
    description:
      "Charge your car 100% on self-generated free sunshine. Intelligent chargers like Myenergi Zappi communicate with your solar inverter to divert excess solar straight into your car battery.",
    badge: "Zero-Cost Fuel",
    bullets: [
      "Eco & Eco+ charging modes match solar surplus",
      "Avoid drawing expensive peak grid power",
      "Dynamic real-time solar tracking",
      "Detailed kWh tracking and reporting in app",
    ],
  },
  {
    title: "Commercial & Strata Charging",
    description:
      "Turnkey charging solutions for workplaces, fleet depots, apartment buildings, and retail carparks with billing and RFID access controls.",
    badge: "Fleet & Commercial",
    bullets: [
      "Dual-socket commercial charging pedestals",
      "OCPP-compliant software for billing & access control",
      "Dynamic load management across multiple bays",
      "Scheduled charging during off-peak commercial tariffs",
    ],
  },
  {
    title: "Smart Load Balancing",
    description:
      "Worried about tripping the main breaker when running air conditioning, an oven, and charging an EV at once? Our dynamic load sensors modulate charging power automatically.",
    badge: "Prevent Overloads",
    bullets: [
      "CT clamp monitoring of main incoming mains supply",
      "Automatically throttles charger if house load spikes",
      "Eliminates costly utility supply upgrades in most cases",
      "Full compliance with EvoEnergy connection standards",
    ],
  },
  {
    title: "Switchboard Capacity Upgrades",
    description:
      "Many older Canberra homes in Belconnen, Woden, or Tuggeranong require a switchboard refresh or capacity upgrade to safely handle a continuous 32A electric vehicle load.",
    badge: "Safety Compliant",
    bullets: [
      "Assessment of consumer mains and service fuses",
      "Installation of modern RCBO circuit breakers",
      "Sub-panel installations for detached garages",
      "Full ACT compliance certificate supplied upon completion",
    ],
  },
  {
    title: "All Major Brand Support",
    description:
      "We supply and install top-rated EV chargers or install your customer-supplied charger (e.g. Tesla Gen 3 Wall Connector, Ocular, Schneider, Wallbox, Delta).",
    badge: "Universal Compatibility",
    bullets: [
      "Tesla Wall Connector Gen 3",
      "Myenergi Zappi (Solar Smart)",
      "Ocular LTE & IQ Home",
      "Wallbox Pulsar Plus",
    ],
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How fast will a home Level 2 EV charger charge my electric car?",
    answer:
      "A single-phase 7.4kW (32A) Level 2 charger provides approximately 40 to 45km of driving range per hour of charge — easily fully replenishing an average 60kWh battery overnight. If your home has three-phase power, an 11kW or 22kW charger can deliver up to 100km+ of range per hour.",
  },
  {
    question: "Can I charge my EV using only solar power?",
    answer:
      "Yes! With a smart solar-integrated charger like the Myenergi Zappi or Fronius Wattpilot, the charger monitors your home's solar output. If your solar panels produce 5kW of excess energy, the charger automatically directs that 5kW into your EV battery rather than sending it back to the grid for a low feed-in tariff.",
  },
  {
    question: "Do I need to upgrade my electrical switchboard to install an EV charger?",
    answer:
      "Not necessarily. We conduct a load calculation on your property. If your switchboard has sufficient capacity and modern safety switches, we can install directly. If your board has older ceramic fuses or near-capacity mains, we can perform a switchboard upgrade or install a dynamic load balancing system.",
  },
  {
    question: "Do you install customer-supplied Tesla Wall Connectors?",
    answer:
      "Yes, absolutely. Many of our Canberra clients purchase the Tesla Wall Connector directly with their vehicle. We provide the complete licensed electrical installation, dedicated circuit wiring, safety testing, and official ACT Certificate of Electrical Compliance.",
  },
  {
    question: "Are there ACT government rebates for EV chargers?",
    answer:
      "Certain smart EV charger installations can be financed under the ACT Government Sustainable Household Scheme with zero-interest loans over up to 10 years when combined with energy efficiency improvements.",
  },
];

export default function EVChargersPage() {
  return (
    <>
      <ServiceHero
        title="EV Charger Installation Canberra & ACT"
        tagline="Charge Smarter. Drive Greener."
        description="Fast, safe, and smart EV charger installations for residential and commercial properties. Licensed electrical installation for Tesla, BYD, Ocular, Zappi, and all electric vehicles."
        primaryCtaText="Request EV Charger Quote"
        primaryCtaHref="/quote?service=ev-chargers"
      />

      <ServiceFeatures
        title="Safe, High-Speed Charging Solutions"
        subtitle="Enjoy seamless home and workplace EV charging with tailored electrical solutions built to Australian Standard AS/NZS 3000."
        features={FEATURES}
      />

      <ProcessSteps
        title="How We Install Your EV Charger"
        subtitle="A quick, professional installation process designed to get you on the road with total confidence."
      />

      <ServiceFAQ
        title="Frequently Asked Questions: EV Chargers"
        faqs={FAQS}
      />

      <ServiceCTA
        title="Ready to Install Your Home EV Charger?"
        subtitle="Get a transparent, fixed-price quote from Justin George. Fast scheduling across all Canberra suburbs."
        primaryCtaText="Get a Free EV Charger Quote"
        primaryCtaHref="/quote?service=ev-chargers"
      />

      <RelatedServices currentSlug="ev-chargers" />
    </>
  );
}
