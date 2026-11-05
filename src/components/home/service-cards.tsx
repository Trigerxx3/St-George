import Link from "next/link";
import { ArrowRight, CheckCircle2, Sun, BatteryCharging, Wrench, Wind, Cctv, type LucideIcon } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import SectionHeading from "@/components/ui/section-heading";
import Reveal from "@/components/ui/reveal";

const ICONS: Record<string, LucideIcon> = {
  Sun,
  BatteryCharging,
  Wrench,
  Wind,
  Cctv,
};

const IMAGES: Record<string, { src: string; alt: string }> = {
  "solar-battery": {
    src: "/images/services/battery-storage.jpg",
    alt: "Solar panels and battery storage installation in Canberra",
  },
  "ev-chargers": {
    src: "/images/services/ev-charger.jpg",
    alt: "Home and commercial EV charger installation",
  },
  electrical: {
    src: "/images/services/switchboard.jpg",
    alt: "Electrical switchboard upgrade and general electrical services",
  },
  "heating-cooling": {
    src: "/images/services/heating-cooling.jpg",
    alt: "Air conditioning and climate control installation",
  },
  "security-cctv": {
    src: "/images/services/security-cctv.jpg",
    alt: "Security and CCTV camera installation",
  },
};

export default function ServiceCards() {
  return (
    <section id="services" className="section-light section-padding scroll-mt-16">
      <div className="container-custom">
        <SectionHeading
          eyebrow="01 — What We Do"
          line1="All Works &"
          line2="Services We Provide"
          intro="Browse our five core divisions below to see every service we complete across Canberra & surrounding regions, then request your free quote in one click."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => {
            const Icon = ICONS[svc.icon] || Wrench;
            const img = IMAGES[svc.slug] || IMAGES.electrical;
            const divisionNumber = String(i + 1).padStart(2, "0");

            return (
              <Reveal key={svc.slug} delay={i * 60}>
                <article className="h-full flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden card-hover group">
                  {/* Top visual banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-950">
                    <img
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={450}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-navy-950/90 backdrop-blur text-orange-light text-xs font-extrabold tracking-wider uppercase border border-orange/30">
                        Division {divisionNumber}
                      </span>
                    </div>
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2.5 text-white">
                      <span className="w-9 h-9 rounded-lg bg-orange-strong text-white flex items-center justify-center shrink-0 shadow">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-white/75 font-semibold leading-none mb-0.5">
                          {svc.shortTitle}
                        </p>
                        <h3 className="text-lg font-extrabold text-white leading-tight">
                          {svc.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Full checklist of works done */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-body-muted text-xs sm:text-sm leading-relaxed mb-4">
                        {svc.description}
                      </p>

                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink mb-2.5">
                        Works Included:
                      </p>
                      <ul className="space-y-2 mb-6 text-xs sm:text-sm text-gray-700">
                        {svc.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <CheckCircle2 size={15} className="text-orange-strong shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Direct actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/quote?service=${svc.slug}`}
                        className="btn-primary !py-2.5 !px-4 text-xs flex-1 justify-center"
                      >
                        Get a Quote <span aria-hidden="true">↗</span>
                      </Link>
                      <Link
                        href={svc.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-orange-strong px-3 py-2.5 rounded-xl border border-gray-200 hover:border-orange-strong/40 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
