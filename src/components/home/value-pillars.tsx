import { Shield, Clock, Zap } from "lucide-react";
import { VALUE_PILLARS } from "@/lib/constants";
import Reveal from "@/components/ui/reveal";

const ICONS = {
  Shield: Shield,
  Clock: Clock,
  Zap: Zap,
} as const;

export default function ValuePillars() {
  return (
    <section className="section-light section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PILLARS.map((pillar, i) => {
            const Icon = ICONS[pillar.icon];
            return (
              <Reveal key={pillar.title} delay={i * 80}>
                <div className="h-full bg-white rounded-2xl border border-gray-200 p-8 card-hover group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-orange-strong/25 text-orange-strong mb-6 group-hover:bg-orange-strong group-hover:text-white transition-colors duration-300">
                    <Icon size={26} strokeWidth={1.4} />
                  </div>
                  <h3 className="text-xl text-ink mb-3">{pillar.title}</h3>
                  <p className="text-body-muted text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
