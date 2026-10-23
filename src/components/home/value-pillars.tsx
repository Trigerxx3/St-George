import { Shield, Clock, Zap } from "lucide-react";
import { VALUE_PILLARS } from "@/lib/constants";

const ICONS = {
  Shield: Shield,
  Clock: Clock,
  Zap: Zap,
} as const;

export default function ValuePillars() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PILLARS.map((pillar, i) => {
            const Icon = ICONS[pillar.icon];
            return (
              <div
                key={pillar.title}
                className="text-center p-8 rounded-xl bg-off-white border border-gray-100 card-hover group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-green/10 text-green mb-5 group-hover:bg-green group-hover:text-white transition-all duration-300">
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                <h3
                  className="text-xl text-navy mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pillar.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
