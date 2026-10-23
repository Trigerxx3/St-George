import { CheckCircle2 } from "lucide-react";

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

export default function ServiceFeatures({
  title,
  subtitle,
  badgeText = "Why Choose St George",
  features,
  columns = 3,
}: ServiceFeaturesProps) {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-primary mb-3">{badgeText}</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-gray-500 text-base sm:text-lg">{subtitle}</p>}
        </div>

        {/* Feature Grid */}
        <div
          className={`grid gap-6 ${
            columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="card group hover:border-green/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {feature.badge && (
                  <span className="inline-block text-xs font-semibold text-green bg-green/10 px-2.5 py-1 rounded-full mb-3">
                    {feature.badge}
                  </span>
                )}
                <h3
                  className="text-xl font-bold text-navy mb-2.5 group-hover:text-green transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>

              {feature.bullets && feature.bullets.length > 0 && (
                <ul className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-700">
                  {feature.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
