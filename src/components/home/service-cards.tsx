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
    gradient: "from-navy-light to-navy",
  },
  {
    icon: Wrench,
    title: "Electrical Services",
    tagline: "Trusted. Experienced. Professional.",
    description:
      "Complete electrical services — installations, repairs, switchboard upgrades, lighting, rewiring, and fault finding by licensed electricians.",
    features: ["Installations & repairs", "Switchboard upgrades", "LED lighting", "Safety inspections"],
    href: "/electrical",
    gradient: "from-gray-700 to-gray-900",
  },
];

export default function ServiceCards() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Complete Electrical{" "}
            <span className="text-green">Solutions</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From EV charger installations to full electrical services, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} text-white p-8 lg:p-10 card-hover group`}
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-green/20 transition-colors">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>

                  <h3
                    className="text-2xl lg:text-3xl mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-orange-light text-sm font-medium mb-4">
                    {card.tagline}
                  </p>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Features */}
                  <ul className="grid grid-cols-2 gap-2 mb-8 text-sm text-white/60">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green rounded-full shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-green transition-colors group/link"
                  >
                    Learn More
                    <ArrowRight
                      size={16}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
