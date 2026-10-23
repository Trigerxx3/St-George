import { ArrowRight, MapPin, Sun } from "lucide-react";
import Link from "next/link";

/* ─── Placeholder case studies ─── */
const CASE_STUDIES = [
  {
    title: "Solar + Battery Install",
    location: "Canberra, ACT",
    service: "Solar & Battery",
    description: "6.6kW solar system with 10kWh battery storage for a family home in Canberra.",
    slug: "canberra-solar-battery",
  },
  {
    title: "Commercial EV Charging",
    location: "Queanbeyan, NSW",
    service: "EV Chargers",
    description: "Multi-bay EV charging station installation for a commercial car park.",
    slug: "queanbeyan-ev-charging",
  },
  {
    title: "Switchboard Upgrade",
    location: "Belconnen, ACT",
    service: "Electrical",
    description: "Full switchboard upgrade with safety switch installation for an older home.",
    slug: "belconnen-switchboard",
  },
];

export default function CaseStudyPreview() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2
              className="text-3xl sm:text-4xl text-navy mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our <span className="text-green">Projects</span>
            </h2>
            <p className="text-gray-500 max-w-md">
              See what we've delivered for homes and businesses across the ACT.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-green font-semibold text-sm hover:text-green-dark transition-colors group"
          >
            View Full Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.slug}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover group"
            >
              {/* Image placeholder */}
              <div className="placeholder-image aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                <div className="text-center text-gray-400">
                  <Sun size={32} strokeWidth={1} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs">[Before / After Photo]</p>
                </div>
                {/* Service badge */}
                <span className="absolute top-3 left-3 bg-navy/80 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {study.service}
                </span>
              </div>

              <div className="p-5">
                <h3
                  className="text-lg text-navy mb-1 group-hover:text-green transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {study.title}
                </h3>
                <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <MapPin size={12} />
                  {study.location}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {study.description}
                </p>
                <p className="text-[10px] text-gray-300 mt-2">[PLACEHOLDER]</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
