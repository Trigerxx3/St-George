import type { Metadata } from "next";
import ServiceHero from "@/components/services/service-hero";
import ServiceFeatures, { FeatureItem } from "@/components/services/service-features";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";
import RelatedServices from "@/components/services/related-services";

export const metadata: Metadata = {
  title: "Licensed Electrician Canberra | Electrical Services St George",
  description:
    "Comprehensive electrical services for homes, businesses, and industrial sites across Canberra & ACT. Switchboard upgrades, LED lighting, rewiring, safety checks. Call 0450 598 628.",
  keywords: [
    "electrician Canberra",
    "switchboard upgrade Canberra",
    "emergency electrician ACT",
    "smoke alarm installation Canberra",
    "commercial electrician Canberra",
    "St George Electrical",
  ],
};

const FEATURES: FeatureItem[] = [
  {
    title: "Switchboard & Safety Switch Upgrades",
    description:
      "Replace dangerous old ceramic fuse boxes with modern enclosures fitted with combination residual current circuit breakers (RCBOs) that protect against electrocution and electrical fires.",
    badge: "Life-Saving Protection",
    bullets: [
      "Individual RCBO safety switches per circuit",
      "Surge protection devices (SPD) safeguarding electronics",
      "Removal of outdated asbestos backing panels",
      "Official ACT Certificate of Compliance issued",
    ],
  },
  {
    title: "LED Lighting Design & Retrofits",
    description:
      "Transform your space and slash lighting electricity costs by up to 80% with modern architectural LED downlights, dimmers, track lighting, and exterior security sensor lights.",
    badge: "Save Up to 80% Energy",
    bullets: [
      "Warm/cool switchable tri-colour LED downlights",
      "Smart lighting controls & smart dimming systems",
      "Commercial office LED panel retrofits",
      "Exterior security sensor & flood lighting",
    ],
  },
  {
    title: "Rewiring & Renovation Electrical",
    description:
      "Complete electrical fit-outs for kitchen, bathroom, and whole-home renovations. We safely upgrade deteriorating vulcanised Indian rubber (VIR) and cotton cabling.",
    badge: "Renovations & Extensions",
    bullets: [
      "Modern TPS cable installations",
      "Appliance dedicated circuits (induction cooktops, ovens)",
      "Smart home cabling and data points",
      "Clean, tidy cabling with minimal wall disruption",
    ],
  },
  {
    title: "Interconnected Smoke Alarms",
    description:
      "Protect your family with 240V mains-powered photoelectric smoke alarms with 10-year lithium battery backup, fully compliant with updated ACT building and tenancy legislation.",
    badge: "ACT Tenancy Compliant",
    bullets: [
      "Interconnected: when one detects smoke, all sound",
      "Compliant with AS 3786:2014 standards",
      "Landlord safety compliance certificates",
      "Annual testing and detector replacement",
    ],
  },
  {
    title: "Fault Finding & Diagnostics",
    description:
      "Experiencing tripping breakers, flickering lights, or unexplained power outages? Our advanced testing gear quickly isolates short circuits and earth leakage issues.",
    badge: "Accurate Diagnostics",
    bullets: [
      "Insulation resistance & earth loop impedance testing",
      "Thermal hotspot checks on high-current connections",
      "Detection of hidden moisture or pest wire damage",
      "Prompt, permanent fixes without recurring issues",
    ],
  },
  {
    title: "Power Points & Appliance Circuits",
    description:
      "Add convenient extra power outlets, outdoor weatherproof USB outlets, dedicated circuits for high-draw split systems, spas, workshop machinery, and heavy equipment.",
    badge: "High-Load Capacity",
    bullets: [
      "Double power points with integrated USB-C PD fast chargers",
      "Weatherproof IP66 external power points",
      "Dedicated circuits for air conditioning & heat pumps",
      "Three-phase industrial socket outlets",
    ],
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How do I know if my switchboard needs an upgrade?",
    answer:
      "If your switchboard still has rewirable ceramic fuses, lacks safety switches (RCDs), frequently trips when you run multiple appliances, or contains black asbestos backing board, it needs an immediate upgrade to comply with AS/NZS 3000 and ensure your family's safety.",
  },
  {
    question: "Do you supply official ACT compliance certificates?",
    answer:
      "Yes. As a licensed electrical contractor (ACT Licence #2028729), we test every installation and lodge an ACT Certificate of Electrical Compliance for all notifiable electrical work with Access Canberra.",
  },
  {
    question: "Can I book a prompt repair or safety inspection?",
    answer:
      "Absolutely. You can use our online Booking Request form or call Justin directly on 0450 598 628. We provide prompt scheduling across all Canberra regions including Belconnen, Gungahlin, Woden, Tuggeranong, and Queanbeyan.",
  },
  {
    question: "Do you assist landlords and property managers with rental safety standards?",
    answer:
      "Yes. We conduct complete rental property electrical safety audits, testing smoke alarms, RCD safety switch trip times, earthing integrity, and providing formal documentation for tenancy compliance.",
  },
];

export default function ElectricalPage() {
  return (
    <>
      <ServiceHero
        title="Licensed Electrical Services Canberra"
        tagline="Trusted. Experienced. Professional."
        description="Comprehensive electrical contracting for homes, businesses, and industrial facilities. From switchboard upgrades and renovations to fault finding and compliance testing."
        primaryCtaText="Book an Electrician"
        primaryCtaHref="/booking"
        imageSrc="/images/services/switchboard.jpg"
        imageAlt="Modern switchboard and electrical safety switches Canberra"
      />

      <ServiceFeatures
        title="Quality Electrical Workmanship You Can Rely On"
        subtitle="Every project is completed to the highest Australian standards with zero compromise on safety."
        features={FEATURES}
      />

      <ProcessSteps
        title="Our Straightforward Service Process"
        subtitle="Prompt communication, upfront quoting, clean workmanship, and licensed sign-off."
      />

      <ServiceFAQ
        title="Frequently Asked Questions: Electrical Services"
        faqs={FAQS}
      />

      <ServiceCTA
        title="Need an Experienced Electrician in Canberra?"
        subtitle="Call Justin George directly or request a service booking online today."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/quote?service=electrical"
      />

      <RelatedServices currentSlug="electrical" />
    </>
  );
}
