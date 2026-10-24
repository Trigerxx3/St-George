import Link from "next/link";
import { BatteryCharging, Wrench, ArrowRight } from "lucide-react";

const CARDS = [
  {
    icon: BatteryCharging,
    title: "EV Charger Installation",
    tagline: "Charge Smarter. Drive Greener.",
    description:
      "Future-proof your home or business with professional EV charger installation. Single-phase, three-phase, and solar-integrated options.",
    features: ["Home & commercial", "All major brands", "Smart charging", "Solar integration"],
    href: "/ev-chargers",
    image: "/images/services/ev-charger.jpg",
    alt: "Modern home EV wall charger charging electric vehicle",
  },
  {
    icon: Wrench,
    title: "Electrical Services",
    tagline: "Trusted. Experienced. Professional.",
    description:
      "Complete electrical services — switchboard upgrades, RCBO safety switches, LED lighting retrofits, rewiring, and fault finding by licensed electricians.",
    features: ["Installations & repairs", "Switchboard upgrades", "LED lighting", "Safety inspections"],
    href: "/electrical",
    image: "/images/services/switchboard.jpg",
    alt: "Modern Australian electrical switchboard upgrade with RCBO safety switches",
  },
];

export default function ServiceCards() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl text-navy mb-3 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Complete Electrical{" "}
            <span className="text-green">Solutions</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            From smart EV charger installations to complete switchboard upgrades, we deliver quality workmanship you can rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group bg-white"
              >
                {/* Visual Header Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy/5">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md text-navy flex items-center justify-center shadow-lg">
                    <Icon size={24} className="text-green" />
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-2xl text-navy mb-1 font-bold group-hover:text-green transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-orange text-xs font-bold uppercase tracking-wider mb-3">
                      {card.tagline}
                    </p>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Features list */}
                    <ul className="grid grid-cols-2 gap-2 mb-6 text-xs text-gray-700">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green rounded-full shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-green transition-colors"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={`/quote?service=${card.href.replace("/", "")}`}
                      className="btn-primary !py-2 !px-4 text-xs font-semibold"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
