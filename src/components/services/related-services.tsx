import Link from "next/link";
import { ArrowRight, Sun, BatteryCharging, Wrench, LucideIcon } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  Sun,
  BatteryCharging,
  Wrench,
};

interface RelatedServicesProps {
  currentSlug: string;
  title?: string;
  subtitle?: string;
}

export default function RelatedServices({
  currentSlug,
  title = "Explore Our Other Services",
  subtitle = "Complete end-to-end electrical and renewable energy solutions for Canberra properties.",
}: RelatedServicesProps) {
  const others = SERVICES.filter((s) => s.slug !== currentSlug);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-primary mb-3">Comprehensive Capabilities</span>
          <h2
            className="text-3xl sm:text-4xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {others.map((service) => {
            const Icon = ICON_MAP[service.icon] || Wrench;
            return (
              <Link
                key={service.slug}
                href={service.href}
                className="group card hover:border-green/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy group-hover:bg-green group-hover:text-white transition-colors flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3
                    className="text-2xl text-navy mb-2 group-hover:text-green transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-green group-hover:gap-3 transition-all pt-3 border-t border-gray-100">
                  <span>Learn more</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
