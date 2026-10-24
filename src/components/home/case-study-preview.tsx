import { ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CASE_STUDIES = [
  {
    title: "10kW Solar + Tesla Powerwall 3",
    location: "Gungahlin, ACT",
    service: "Solar & Battery",
    description: "23x Jinko N-Type panels paired with Tesla Powerwall 3 for full whole-home blackout resilience.",
    slug: "canberra-solar-battery",
    image: "/images/hero/hero-solar-home.jpg",
  },
  {
    title: "Commercial 30kW Solar Array",
    location: "Hume, ACT",
    service: "Commercial Solar",
    description: "Heavy-duty commercial rooftop solar system offsetting warehouse daytime power usage.",
    slug: "hume-commercial-solar",
    image: "/images/services/commercial-solar.jpg",
  },
  {
    title: "Clipsal RCBO Switchboard Modernisation",
    location: "Belconnen, ACT",
    service: "Electrical Safety",
    description: "Replaced 1970s rewirable ceramic fuses with individual life-saving RCBO safety switches.",
    slug: "belconnen-switchboard",
    image: "/images/services/switchboard.jpg",
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
              className="text-3xl sm:text-4xl text-navy mb-2 font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Recent Canberra <span className="text-green">Projects</span>
            </h2>
            <p className="text-gray-500 max-w-md text-sm sm:text-base">
              Verified installations delivered for homes and commercial facilities across the ACT.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-green font-semibold text-sm hover:text-green-dark transition-colors group"
          >
            View Full Project Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.slug}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Real project photo */}
                <div className="aspect-[16/10] overflow-hidden relative bg-navy/5">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Service badge */}
                  <span className="absolute top-3 left-3 bg-navy/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    {study.service}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
                    <MapPin size={13} className="text-green" />
                    <span>{study.location}</span>
                  </div>
                  <h3
                    className="text-xl text-navy mb-2 font-bold group-hover:text-green transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {study.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {study.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green hover:underline"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
