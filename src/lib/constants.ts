import {
  Sun,
  Zap,
  BatteryCharging,
  Home,
  Building2,
  Factory,
  Wrench,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";

/* ─── Business Information ─── */
export const BUSINESS = {
  name: "St George Electrical Energy Solutions",
  shortName: "St George Electrical",
  owner: "Justin George",
  phone: "0450598628",
  phoneDisplay: "0450 598 628",
  email: "justingeorge@zohomail.com.au",
  licence: "2028729",
  tagline: "Powering your Home & Business with Confidence.",
  abn: "", // TODO_OWNER: Add ABN
  address: {
    street: "", // TODO_OWNER: Add street address
    suburb: "Canberra",
    state: "ACT",
    postcode: "2600", // TODO_OWNER: Verify postcode
    country: "Australia",
  },
  social: {
    facebook: "", // TODO_OWNER: Add Facebook URL
    instagram: "", // TODO_OWNER: Add Instagram URL
    google: "", // TODO_OWNER: Add Google Business Profile URL
    whatsapp: "https://wa.me/61450598628",
  },
} as const;

/* ─── Value Pillars ─── */
export const VALUE_PILLARS = [
  {
    icon: "Shield" as const,
    title: "Quality Work Every Time",
    description:
      "Every project is completed to the highest Australian standards. We never cut corners — your safety and satisfaction come first.",
  },
  {
    icon: "Clock" as const,
    title: "Reliable Service You Can Count On",
    description:
      "On time, every time. We show up when we say we will and get the job done right, with clear communication throughout.",
  },
  {
    icon: "Zap" as const,
    title: "Peace of Mind Always",
    description:
      "Fully licensed, insured and backed by manufacturer warranties. Rest easy knowing your electrical systems are in expert hands.",
  },
] as const;

/* ─── Services ─── */
export interface ServiceInfo {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
  href: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    slug: "solar-battery",
    title: "Solar & Battery Solutions",
    shortTitle: "Solar & Battery",
    tagline: "Smart. Sustainable. Reliable.",
    description:
      "Harness the power of the sun with premium solar panel and battery storage solutions. We design and install systems tailored to your home or business, helping you save on energy costs and reduce your carbon footprint.",
    icon: "Sun",
    features: [
      "Premium solar panel installation",
      "Home battery storage systems",
      "Residential & commercial packages",
      "System design & consultation",
      "Monitoring & maintenance",
      "Grid-connect & off-grid solutions",
    ],
    href: "/solar-battery",
  },
  {
    slug: "ev-chargers",
    title: "EV Charger Installation",
    shortTitle: "EV Chargers",
    tagline: "Charge Smarter. Drive Greener.",
    description:
      "Future-proof your home or business with professional EV charger installation. From single-phase home chargers to three-phase commercial solutions, we supply and install smart, solar-integrated charging stations.",
    icon: "BatteryCharging",
    features: [
      "Home EV charger installation",
      "Commercial charging stations",
      "Single & three-phase options",
      "Smart / solar-integrated charging",
      "All major EV charger brands",
      "Load management solutions",
    ],
    href: "/ev-chargers",
  },
  {
    slug: "electrical",
    title: "Electrical Services",
    shortTitle: "Electrical",
    tagline: "Trusted. Experienced. Professional.",
    description:
      "Comprehensive electrical services for homes and businesses. From new installations and repairs to switchboard upgrades and safety inspections, our licensed electricians deliver quality workmanship you can rely on.",
    icon: "Wrench",
    features: [
      "Electrical installations & repairs",
      "Switchboard & safety upgrades",
      "LED lighting solutions",
      "Complete rewiring",
      "Fault finding & diagnostics",
      "Safety inspections & testing",
    ],
    href: "/electrical",
  },
];

/* ─── Sectors ─── */
export interface SectorInfo {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  href: string;
}

export const SECTORS: SectorInfo[] = [
  {
    slug: "domestic",
    title: "Domestic",
    tagline: "Keeping your home safe, comfortable & powered",
    description:
      "Expert electrical solutions for Australian homes. From solar installations to safety upgrades, we keep your family safe and your energy bills low.",
    icon: "Home",
    href: "/domestic",
  },
  {
    slug: "commercial",
    title: "Commercial",
    tagline: "Powering businesses to keep them running",
    description:
      "Reliable electrical services for businesses of all sizes. Minimise downtime, maximise efficiency, and keep your operations running smoothly.",
    icon: "Building2",
    href: "/commercial",
  },
  {
    slug: "industrial",
    title: "Industrial",
    tagline: "Reliable electrical solutions for large-scale operations",
    description:
      "Heavy-duty electrical expertise for industrial facilities. We understand the demands of large-scale operations and deliver solutions built to last.",
    icon: "Factory",
    href: "/industrial",
  },
];

/* ─── Service Areas ─── */
export interface ServiceArea {
  name: string;
  slug: string;
  region: string;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { name: "Canberra", slug: "canberra", region: "ACT" },
  { name: "Queanbeyan", slug: "queanbeyan", region: "NSW" },
  { name: "Goulburn", slug: "goulburn", region: "NSW" },
  { name: "Yass", slug: "yass", region: "NSW" },
  { name: "Gungahlin", slug: "gungahlin", region: "ACT" },
  { name: "Tuggeranong", slug: "tuggeranong", region: "ACT" },
  { name: "Belconnen", slug: "belconnen", region: "ACT" },
  { name: "Woden", slug: "woden", region: "ACT" },
];

/* ─── Navigation ─── */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Services",
    href: "#",
    children: [
      { label: "Solar & Battery", href: "/solar-battery" },
      { label: "EV Chargers", href: "/ev-chargers" },
      { label: "Electrical", href: "/electrical" },
    ],
  },
  {
    label: "Sectors",
    href: "#",
    children: [
      { label: "Domestic", href: "/domestic" },
      { label: "Commercial", href: "/commercial" },
      { label: "Industrial", href: "/industrial" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Solar Panels", href: "/products/solar-panels" },
      { label: "Batteries", href: "/products/batteries" },
      { label: "Inverters", href: "/products/inverters" },
      { label: "EV Chargers", href: "/products/ev-chargers" },
      { label: "Packages", href: "/packages" },
    ],
  },
  {
    label: "Tools",
    href: "#",
    children: [
      { label: "Solar Calculator", href: "/calculator" },
      { label: "EV Charger Selector", href: "/ev-selector" },
      { label: "Rebates & Incentives", href: "/rebates" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/* ─── Product Categories ─── */
export const PRODUCT_CATEGORIES = [
  { name: "Solar Panels", slug: "solar-panels" },
  { name: "Batteries", slug: "batteries" },
  { name: "Inverters", slug: "inverters" },
  { name: "EV Chargers", slug: "ev-chargers" },
  { name: "Switchboard & Safety", slug: "switchboard-safety" },
  { name: "Lighting", slug: "lighting" },
] as const;
