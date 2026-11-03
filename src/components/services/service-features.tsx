import { CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Reveal from "@/components/ui/reveal";

export interface FeatureItem {
  title: string;
  description: string;
  bullets?: string[];
  badge?: string;
}

interface ServiceFeaturesProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
}

function splitTitle(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return { line1: text, line2: "" };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}

export default function ServiceFeatures({
  title,
  subtitle,
  badgeText = "01 — Capabilities",
  features,
  columns = 3,
}: ServiceFeaturesProps) {
  const { line1, line2 } = splitTitle(title);

  return (
    <section className="section-light section-padding">
      <div className="container-custom">
        <SectionHeading eyebrow={badgeText} line1={line1} line2={line2} intro={subtitle} />

        <div
          className={`grid gap-6 ${
            columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {features.map((feature, idx) => (
            <Reveal key={idx} delay={(idx % 3) * 70}>
              <div className="h-full card card-hover group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-extrabold text-orange-strong tracking-[0.14em] uppercase">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {feature.badge && (
                      <span className="inline-block text-[11px] font-bold text-orange-strong bg-orange/10 px-2.5 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl text-ink mb-2.5 group-hover:text-orange-strong transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-body-muted text-sm leading-relaxed mb-5">
                    {feature.description}
                  </p>
                </div>

                {feature.bullets && feature.bullets.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-700">
                    {feature.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-orange-strong shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
