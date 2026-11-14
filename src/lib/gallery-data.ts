import { GalleryItem } from "@/types/catalogue";

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "proj-1",
    title: "10kW High-Yield Solar + Tesla Powerwall 3",
    category: "solar",
    categoryLabel: "Solar & Battery",
    suburb: "Gungahlin, ACT",
    system: "10.1kW Solar + 13.5kWh Tesla Powerwall 3",
    description:
      "Installed 23x Jinko N-Type TOPCon panels paired with the new Tesla Powerwall 3 to provide full home blackout protection and wipe out quarterly bills exceeding $1,100.",
    results: [
      "Zero grid power drawn between 5:00 PM and 10:00 PM peak",
      "Full whole-home EPS backup powering ducted heating during storms",
      "Financed via the ACT Sustainable Household Scheme 0% loan",
    ],
    image: "/images/gallery/gallery-residential-solar.jpg",
    clientQuote:
      "St George Electrical was fantastic from the first measure to the final app handover. Our power bill dropped by over 85% in the first quarter.",
    clientName: "Mark & Sandra T.",
    sort_order: 1,
    isActive: true,
  },
  {
    id: "proj-2",
    title: "Dual 22kW Commercial EV Charging Station & Sub-Panel",
    category: "ev",
    categoryLabel: "EV Chargers",
    suburb: "Fyshwick, ACT",
    system: "2x 22kW Three-Phase Commercial Fast Chargers",
    description:
      "Commercial fleet depot electrical upgrade including new sub-distribution board, Type B safety protection, and load management for EV fleet vans.",
    results: [
      "Overnight full fleet charging ready for morning dispatch",
      "Dynamic load balancing prevents exceeding commercial maximum demand",
      "Full EvoEnergy network approval handled seamlessly",
    ],
    image: "/images/gallery/gallery-commercial-ev.jpg",
    clientQuote:
      "Professional electrical engineering from start to finish. Zero disruption to our business operations.",
    clientName: "David L., Fleet Operations",
    sort_order: 2,
    isActive: true,
  },
  {
    id: "proj-3",
    title: "Complete Switchboard Modernisation & Rewire",
    category: "electrical",
    categoryLabel: "Electrical",
    suburb: "Belconnen, ACT",
    system: "Clipsal Resi9 RCBO Enclosure + Asbestos Panel Removal",
    description:
      "Removed dangerous 1970s rewirable ceramic fuses and deteriorating asbestos backing panel. Installed individual combination safety switches on every circuit.",
    results: [
      "100% compliant with AS/NZS 3000:2018 Wiring Rules",
      "Sub-millisecond trip protection against electric shocks",
      "Official ACT Certificate of Compliance lodged with Access Canberra",
    ],
    image: "/images/gallery/gallery-switchboard.jpg",
    clientQuote:
      "Peace of mind knowing our older home is now completely safe for our children. Neat and tidy work.",
    clientName: "Elena R.",
    sort_order: 3,
    isActive: true,
  },
  {
    id: "proj-4",
    title: "6.6kW Essential Solar Array & 14kWh Battery Setup",
    category: "solar",
    categoryLabel: "Solar & Battery",
    suburb: "Tuggeranong, ACT",
    system: "15x Trina Dual-Glass 435W Panels + 14kWh Hybrid Storage",
    description:
      "Clean rooftop solar and battery installation optimized for winter morning sun angles in south Canberra. Real-time smartphone monitoring configured.",
    results: [
      "91% self-consumption rate achieved in first month",
      "Continuous power monitoring and cloud-synced app control",
      "Clean concealed conduit runs down internal cavity",
    ],
    image: "/images/gallery/gallery-battery-storage.jpg",
    clientQuote:
      "Cleanest trade installation I have ever seen. No exposed messy wires and Justin explained everything patiently.",
    clientName: "Chris K.",
    sort_order: 4,
    isActive: true,
  },
  {
    id: "proj-5",
    title: "Industrial Distribution Board & Power Factor Correction",
    category: "commercial",
    categoryLabel: "Commercial & Industrial",
    suburb: "Mitchell, ACT",
    system: "400A Main Switchboard & Automated Power Factor Cubicle",
    description:
      "Engineered industrial power distribution board replacement for high-demand manufacturing facility. Upgraded metering and thermal surge suppression.",
    results: [
      "Eliminated EvoEnergy network kVA maximum demand penalties",
      "Isolated shutdown performed over single weekend zero production lost",
      "Thermographic heat scan report issued with zero hot spots",
    ],
    image: "/images/gallery/gallery-industrial-switchboard.jpg",
    clientQuote:
      "Justin and his team worked through the weekend so our Monday shift could start right on 6 AM without a hitch.",
    clientName: "Brett M., Plant Manager",
    sort_order: 5,
    isActive: true,
  },
  {
    id: "proj-6",
    title: "Architectural LED Downlight & Smart Lighting Upgrade",
    category: "electrical",
    categoryLabel: "Residential Lighting",
    suburb: "Yarralumla, ACT",
    system: "C-Bus Smart Lighting Automation & Low-Glare 3000K Warm LEDs",
    description:
      "Replaced energy-wasting halogen downlights with premium low-glare warm white LEDs. Integrated dimming scenes and illuminated outdoor entertaining areas.",
    results: [
      "80% reduction in lighting power consumption",
      "Zero fire hazard compared to obsolete 50W halogen cans",
      "App-controlled welcome and away lighting scenes",
    ],
    image: "/images/gallery/gallery-lighting-downlights.jpg",
    clientQuote:
      "The ambience of our home was completely transformed. The dimming control is intuitive and smooth.",
    clientName: "Sophie & Liam H.",
    sort_order: 6,
    isActive: true,
  },
  {
    id: "proj-7",
    title: "Whole-Home Multi-Head Reverse Cycle Heat Pump Setup",
    category: "hvac",
    categoryLabel: "Heating & Cooling",
    suburb: "Kingston, ACT",
    system: "High-Efficiency Reverse Cycle Split System Heat Pump",
    description:
      "Installed whisper-quiet split system heating and cooling providing independent zone control across living and bedroom areas with sleek indoor wall heads.",
    results: [
      "Rapid winter heating performance down to sub-zero temperatures",
      "Over 40% reduction in heating running costs versus old resistive heaters",
      "ACT Energy Efficiency Improvement Scheme rebate applied",
    ],
    image: "/images/services/heating-cooling.jpg",
    clientQuote:
      "The warmth in winter and cooling in summer is instant and super quiet. Installation was tidy and on time.",
    clientName: "Marcus T.",
    sort_order: 7,
    isActive: true,
  },
  {
    id: "proj-8",
    title: "4K Commercial & Residential CCTV Surveillance Network",
    category: "security",
    categoryLabel: "Security & CCTV",
    suburb: "Deakin, ACT",
    system: "Smart 4K Ultra-HD Turret IP Cameras & NVR Network",
    description:
      "Perimeter security overhaul featuring 8x ultra-HD smart turret cameras with AI person and vehicle detection, infrared night vision, and instant mobile alerts.",
    results: [
      "Zero false alarms with AI vehicle/human classification",
      "24/7 continuous local recording with remote phone app monitoring",
      "Concealed weatherproof cabling with tamper-proof mounting",
    ],
    image: "/images/services/security-cctv.jpg",
    clientQuote:
      "Crystal clear night vision and the phone notifications give us complete peace of mind when we travel.",
    clientName: "Julian & Sarah M.",
    sort_order: 8,
    isActive: true,
  },
];

