export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "act-sustainable-household-scheme-guide",
    title: "How to Claim the ACT Sustainable Household Scheme $15,000 Zero-Interest Loan",
    excerpt:
      "A complete homeowner guide to accessing up to $15,000 in interest-free financing over 10 years for rooftop solar, home battery storage, and smart EV chargers in Canberra.",
    author: "Justin George",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Rebates & Finance",
    content: [
      "The ACT Government's Sustainable Household Scheme (SHS) is one of Australia's most generous residential clean energy initiatives. It provides eligible ACT homeowners with interest-free loans between $2,000 and $15,000 to assist with the upfront cost of energy-efficient home upgrades.",
      "Eligible technologies under the scheme include rooftop solar panels, household battery storage systems, electric vehicle (EV) charging infrastructure, and energy-efficient reverse-cycle electric heating and cooling systems.",
      "To be eligible, you must own an ACT residential property with an unimproved land value below the designated threshold (which includes the vast majority of standalone houses and townhouses across Canberra). There are zero loan application fees, zero interest charges, and no penalties for early repayment.",
      "How does the application process work? First, you contact an accredited installer like St George Electrical Energy Solutions for a formal, compliant quote. We prepare the system design and itemized proposal. Next, you submit the quote via Brighte, the ACT Government's scheme administrator. Once approved, we schedule your installation, and payment is processed directly through the scheme once work is completed and verified.",
      "When combined with Federal Small-scale Technology Certificates (STCs), Canberra homeowners can eliminate thousands in upfront expenses while repaying the loan balance interest-free from the electricity bill savings the system immediately generates.",
    ],
  },
  {
    id: "post-2",
    slug: "canberra-ev-charger-installation-guide",
    title: "Home EV Charger Installation in Canberra: Level 2 vs Level 1 & Switchboard Checklist",
    excerpt:
      "Everything Canberra electric car owners need to know about charging speeds, 32-amp dedicated circuits, solar smart chargers, and whether your switchboard is ready.",
    author: "Justin George",
    date: "February 2, 2025",
    readTime: "6 min read",
    category: "EV Chargers",
    content: [
      "With Canberra having the highest per-capita adoption of electric vehicles in Australia, home charging infrastructure has quickly become an essential residential electrical service.",
      "Most new EV owners quickly discover that standard 10A granny chargers (Level 1) plugged into ordinary wall sockets are painfully slow, adding only 10 to 12km of driving range per hour. A dedicated Level 2 wall charger running at 32 amps delivers 7.4kW (single-phase) to 22kW (three-phase), replenishing 45km to 100km+ of range per hour.",
      "What electrical considerations are involved? First, a continuous 32-amp draw requires a dedicated sub-circuit wired with heavy 6mm² or 10mm² cable directly from your main electrical switchboard. Second, modern Australian Standards (AS/NZS 3000) require specialized Type B residual current devices (RCDs) capable of detecting both AC and DC residual fault currents.",
      "If you already have rooftop solar panels, consider investing in a solar-aware charger such as the Myenergi Zappi. These chargers communicate with external current transformer (CT) clamps on your main supply to automatically throttle charging power so your car drinks only free excess solar power rather than pulling from the grid.",
      "Before purchasing a charger, have a licensed electrician inspect your property's consumer mains and switchboard capacity. Older Canberra homes in established suburbs frequently require a switchboard refresh to ensure safe, reliable charging.",
    ],
  },
  {
    id: "post-3",
    slug: "switchboard-safety-upgrade-canberra-guide",
    title: "Why Canberra Homeowners Need to Replace Old Ceramic Fuse Switchboards",
    excerpt:
      "Rewirable ceramic fuses and deteriorating asbestos panels pose severe electrical fire and shock hazards. Here is why modern RCBO safety switches are life-saving.",
    author: "Justin George",
    date: "February 20, 2025",
    readTime: "4 min read",
    category: "Electrical Safety",
    content: [
      "Thousands of homes built across Canberra between the 1960s and 1980s in Belconnen, Woden, Weston Creek, and Tuggeranong still rely on original electrical switchboards equipped with rewirable ceramic fuses.",
      "Ceramic fuses were designed solely to protect copper cables from overheating—they offer zero protection against electric shock or electrocution. If a person accidentally touches a live wire or damaged appliance, a fuse will not blow in time to prevent serious injury or death.",
      "Modern switchboard upgrades replace these outdated fuse blocks with individual Residual Current Circuit Breakers with Overcurrent Protection (RCBOs). An RCBO monitors the current balance between active and neutral lines. If an imbalance as tiny as 30 milliamperes is detected (such as current leaking through a human body or damaged wire), the RCBO disconnects power within 30 milliseconds.",
      "Furthermore, older Canberra switchboards frequently contain black asbestos backing board (Zelemite or Lebah). During a switchboard upgrade, this hazardous material is safely encapsulated or removed in accordance with ACT WorkSafe regulations, and a modern weatherproof enclosure is installed.",
      "Every switchboard upgrade completed by St George Electrical is comprehensively tested with calibrated diagnostic equipment, and an official Certificate of Electrical Compliance is lodged with Access Canberra.",
    ],
  },
  {
    id: "post-4",
    slug: "solar-battery-canberra-worth-it",
    title: "Solar Batteries in Canberra: Are They Worth the Investment in 2025/2026?",
    excerpt:
      "With Canberra's sub-zero winter evenings and daytime solar feed-in tariffs hovering around 7-8c/kWh, does adding a home battery make financial sense?",
    author: "Justin George",
    date: "March 5, 2025",
    readTime: "5 min read",
    category: "Solar & Batteries",
    content: [
      "Canberra's climate presents a unique energy profile: blistering hot summer afternoons with intense solar radiation, followed by freezing winter evenings where heating systems draw maximum power just as the sun sets.",
      "Historically, solar owners relied on generous feed-in tariffs (FiTs) to export power. Today, electricity retailers in the ACT pay approximately 6c to 8c per kWh for solar exports, while charging 30c to 36c per kWh for electricity drawn from the grid during evening peak hours.",
      "This 4x price spread is where a home battery storage system (such as the Tesla Powerwall 3 or Sungrow SBR) creates dramatic value. Instead of exporting your surplus daytime solar generation for a small credit, you store that clean power and consume it to run your ducted heating, hot water, and lighting throughout the night.",
      "With access to the ACT Government's $15,000 zero-interest loan scheme, homeowners no longer have to tie up large cash reserves to install a battery. The monthly loan repayments are often lower than the monthly reduction in your retail power bills, delivering immediate cashflow positive savings.",
      "In addition to financial return, modern batteries provide whole-home Emergency Power Supply (EPS). When Canberra's notorious summer storms knock out grid power, your home lights, refrigeration, Wi-Fi, and medical devices keep running seamlessly.",
    ],
  },
];
