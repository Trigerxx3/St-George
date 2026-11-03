import Link from "next/link";
import { ArrowRight, Sun, BatteryCharging, Wrench, Wind, Cctv, Shield, LucideIcon } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import SectionHeading from "@/components/ui/section-heading";

const ICON_MAP: Record<string, LucideIcon> = {
  Sun,
  BatteryCharging,
  Wrench,
  Wind,
  Cctv,
  Shield,
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
    <section className="section-light section-padding border-t border-gray-200">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Comprehensive Capabilities"
          line1={title}
          intro={subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map((service) => {
            const Icon = ICON_MAP[service.icon] || Wrench;
            return (
              <Link
                key={service.slug}
                href={service.href}
                className="group card card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl border border-orange-strong/25 text-orange-strong group-hover:bg-orange-strong group-hover:text-white transition-colors flex items-center justify-center mb-5">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl text-ink mb-2 group-hover:text-orange-strong transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-body-muted text-sm leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="link-arrow pt-4 border-t border-gray-100">
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
