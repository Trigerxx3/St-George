"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Modal from "@/components/ui/modal";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const closeModal = useCallback(() => setOpenIdx(null), []);

  // Track which card is in view for the pagination dots
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.children[0] as HTMLElement | undefined;
      if (!card) return;
      const step = card.offsetWidth + 24;
      setPage(Math.round(el.scrollLeft / step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const open = openIdx !== null ? CASE_STUDIES[openIdx] : null;

  return (
    <section className="section-light section-padding">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SectionHeading
            eyebrow="05 — Our Work"
            line1="Recent Canberra"
            line2="Projects"
            intro="Verified installations delivered for homes and commercial facilities across the ACT."
            className="flex-1"
          />
        </div>

        {/* Scroll-snap carousel: 3 cards per view on desktop */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {CASE_STUDIES.map((study, i) => (
            <button
              key={study.slug}
              type="button"
              role="listitem"
              onClick={() => setOpenIdx(i)}
              aria-label={`${study.title}, ${study.location}. Open details`}
              className="group relative snap-start shrink-0 basis-[85%] sm:basis-[calc(50%-12px)] lg:basis-[calc((100%-48px)/3)] aspect-[4/5] rounded-2xl overflow-hidden text-left border border-gray-200 card-hover"
            >
              <img
                src={study.image}
                alt=""
                width={800}
                height={1000}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="absolute left-0 right-0 bottom-0 p-5">
                <span className="inline-block rounded-full border border-white/25 bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-semibold text-white mb-3">
                  {study.service}
                </span>
                <div className="flex items-end justify-between gap-3">
                  <h3 className="text-xl text-white">{study.title}</h3>
                  <span className="shrink-0 w-10 h-10 rounded-full bg-orange-strong text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination dots (active = longer orange pill) */}
        <div className="flex justify-center items-center gap-2 mt-8" role="group" aria-label="Project pagination">
          {CASE_STUDIES.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-orange-strong" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/gallery" className="link-arrow">
            View Full Project Gallery
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Modal open={!!open} onClose={closeModal} label={open?.title ?? "Project details"}>
        {open && (
          <>
            <div className="relative aspect-[16/10] w-full">
              <img src={open.image} alt={open.title} width={1000} height={625} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <span className="eyebrow mb-2 !text-orange-strong">{open.service}</span>
              <h3 className="text-2xl text-ink mb-2">{open.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4 font-medium">
                <MapPin size={13} className="text-orange-strong" />
                <span>{open.location}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{open.description}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/gallery" className="btn-primary">
                  Explore Case Study
                  <ArrowUpRight size={16} />
                </Link>
                <Link href="/quote" className="link-arrow">
                  Get a Free Quote
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
