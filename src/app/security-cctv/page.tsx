import type { Metadata } from "next";
import ServiceHero from "@/components/services/service-hero";
import ServiceFeatures, { FeatureItem } from "@/components/services/service-features";
import ProcessSteps from "@/components/services/process-steps";
import ServiceFAQ, { FAQItem } from "@/components/services/service-faq";
import ServiceCTA from "@/components/services/service-cta";
import RelatedServices from "@/components/services/related-services";

export const metadata: Metadata = {
  title: "Security & CCTV Installation Canberra | Surveillance Solutions St George",
  description:
    "Professional CCTV camera installation, residential security systems, commercial surveillance, IP cameras, and remote monitoring in Canberra & ACT. Call 0450 598 628.",
  keywords: [
    "CCTV installation Canberra",
    "security camera installation ACT",
    "commercial surveillance Canberra",
    "IP camera systems Canberra",
    "home security systems Canberra",
    "St George Electrical",
  ],
};

const FEATURES: FeatureItem[] = [
  {
    title: "CCTV Camera Installation",
    description:
      "Crystal-clear ultra-HD security cameras professionally mounted and hardwired with concealed cabling to eliminate blind spots around your property perimeter.",
    badge: "24/7 Deterrence",
    bullets: [
      "4K / 8MP Ultra-HD turret, dome, and bullet cameras",
      "Colour night vision and infrared illumination",
      "Weatherproof IP67 rated exterior housings",
      "Clean, tamper-resistant concealed cable runs",
    ],
  },
  {
    title: "Residential Security Systems",
    description:
      "Protect your family, driveway, entryways, and backyard with smart residential security and alarm systems tailored to your home's layout.",
    badge: "Home Protection",
    bullets: [
      "Front door, driveway, and perimeter coverage",
      "Smart motion detection for people and vehicles",
      "Two-way audio and active siren/spotlight deterrence",
      "Integration with security sensor floodlights",
    ],
  },
  {
    title: "Commercial Surveillance Systems",
    description:
      "Comprehensive multi-camera surveillance for warehouses, retail stores, offices, and industrial depots across Canberra to safeguard stock, staff, and assets.",
    badge: "Business Security",
    bullets: [
      "High-capacity multi-channel commercial NVR setups",
      "Entry/exit, loading dock, and POS coverage",
      "Structured data cabling and secure rack enclosures",
      "Scalable architecture for growing facilities",
    ],
  },
  {
    title: "IP Camera Systems",
    description:
      "Modern Power-over-Ethernet (PoE) digital IP camera networks delivering rock-solid reliability without Wi-Fi dropouts or battery changes.",
    badge: "Hardwired PoE Reliability",
    bullets: [
      "Single Cat6 cable for both power and high-speed data",
      "AI smart event filtering (reduces false alarms from trees/pets)",
      "Wide dynamic range (WDR) for clear images in harsh glare",
      "Dedicated PoE network switch installation",
    ],
  },
  {
    title: "Remote Monitoring & Video Recording Systems",
    description:
      "View live feeds and playback recorded events from anywhere in the world on your smartphone, tablet, or desktop with zero ongoing monthly subscription fees.",
    badge: "Live App Access",
    bullets: [
      "Instant push notifications on motion or line-crossing events",
      "Local Network Video Recorder (NVR) with 24/7 continuous recording",
      "Encrypted remote viewing app configured on your devices",
      "Easy USB/mobile video clip export for evidence",
    ],
  },
  {
    title: "Security System Upgrades & Maintenance",
    description:
      "Upgrade aging analogue coax cameras to modern 4K IP surveillance, expand camera coverage, or service existing recording and security hardware.",
    badge: "Upgrades & Servicing",
    bullets: [
      "Analogue-to-IP high-definition system replacements",
      "Hard drive health checks and storage capacity expansion",
      "Camera lens cleaning, re-aiming, and firmware updates",
      "Fault finding for offline cameras or cabling damage",
    ],
  },
];

const FAQS: FAQItem[] = [
  {
    question: "Are hardwired PoE IP cameras better than wireless Wi-Fi cameras?",
    answer:
      "Yes. Hardwired Power-over-Ethernet (PoE) IP cameras receive continuous power and transmit video over a dedicated data cable. Unlike Wi-Fi cameras, they never need batteries recharged, don't suffer from wireless signal dropouts, and record 24/7 to a secure local Network Video Recorder (NVR).",
  },
  {
    question: "Can I view my CCTV cameras on my phone when I'm away from home?",
    answer:
      "Yes. We configure secure smartphone and tablet apps (iOS and Android) during handover so you can view live camera streams, receive instant motion alerts, and review recorded footage from anywhere.",
  },
  {
    question: "Are there any ongoing monthly subscription fees?",
    answer:
      "No. Because your footage is recorded locally onto your own Network Video Recorder (NVR) hard drive, you own your system outright with zero mandatory monthly cloud fees.",
  },
  {
    question: "Can you upgrade an older security system at my home or business?",
    answer:
      "Absolutely. We regularly replace outdated, blurry systems with modern 4K IP cameras, upgrade NVR recorders, add extra camera points, and tidy up existing cabling.",
  },
];

export default function SecurityCctvPage() {
  return (
    <>
      <ServiceHero
        title="Security & Surveillance Solutions"
        tagline="Division 05 — Security & CCTV"
        description="Professional CCTV camera installation, residential security systems, commercial surveillance, IP camera networks, and remote monitoring across Canberra & surrounding regions."
        primaryCtaText="Get a Free Quote"
        primaryCtaHref="/quote?service=security-cctv"
        imageSrc="/images/services/security-cctv.jpg"
        imageAlt="Commercial and residential CCTV security surveillance installation Canberra"
      />

      <ServiceFeatures
        title="Complete Security & CCTV Capabilities"
        subtitle="Hardwired reliability, ultra-HD clarity, and instant mobile monitoring for homes and businesses."
        features={FEATURES}
      />

      <ServiceCTA
        title="Ready to Secure Your Home or Business?"
        subtitle="Speak directly with St George Electrical for a tailored CCTV and security installation quote."
        primaryCtaText="Request a Quote"
        primaryCtaHref="/quote?service=security-cctv"
      />

      <RelatedServices currentSlug="security-cctv" />
    </>
  );
}

