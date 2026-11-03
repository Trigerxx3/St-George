"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

/* ─── Placeholder testimonials (clearly marked) ─── */
const PLACEHOLDER_TESTIMONIALS = [
  {
    name: "John D.",
    location: "Canberra, ACT",
    rating: 5,
    content:
      "[PLACEHOLDER REVIEW] — Excellent service from start to finish. The team was professional, on time, and the solar system is performing beyond expectations. Highly recommend!",
    service: "Solar & Battery",
  },
  {
    name: "Sarah M.",
    location: "Queanbeyan, NSW",
    rating: 5,
    content:
      "[PLACEHOLDER REVIEW] — Had an EV charger installed at home. The process was smooth, the install was clean, and the team explained everything clearly. Very happy with the result.",
    service: "EV Charger",
  },
  {
    name: "Mike T.",
    location: "Gungahlin, ACT",
    rating: 5,
    content:
      "[PLACEHOLDER REVIEW] — Called for an urgent switchboard issue and they came out the same day. Professional, explained the problem clearly, and fixed it quickly. Great value.",
    service: "Electrical",
  },
  {
    name: "Lisa K.",
    location: "Belconnen, ACT",
    rating: 5,
    content:
      "[PLACEHOLDER REVIEW] — Full rewiring and LED upgrade for our older home. The team was respectful, tidy, and the work quality is outstanding. Couldn't be happier.",
    service: "Electrical",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) =>
      c === 0 ? PLACEHOLDER_TESTIMONIALS.length - 1 : c - 1
    );
  const next = () =>
    setCurrent((c) =>
      c === PLACEHOLDER_TESTIMONIALS.length - 1 ? 0 : c + 1
    );

  return (
    <section className="section-dark section-padding border-t border-white/5">
      <div className="container-custom">
        <SectionHeading
          eyebrow="06 — Testimonials"
          line1="What Our Customers"
          line2="Say"
          intro="Don't just take our word for it — hear from homeowners and businesses we've helped. [PLACEHOLDER REVIEWS — Replace with real Google Reviews]"
        />

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative card-glass p-8 sm:p-10">
            {/* Quote icon */}
            <Quote
              size={48}
              className="absolute top-6 left-6 text-orange/15"
              strokeWidth={1}
            />

            <div className="relative z-10" key={current}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: PLACEHOLDER_TESTIMONIALS[current].rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-orange fill-orange"
                  />
                ))}
              </div>

              {/* Review text */}
              <blockquote className="text-lg sm:text-xl text-white leading-relaxed mb-6 animate-fade-in">
                &ldquo;{PLACEHOLDER_TESTIMONIALS[current].content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-white">
                    {PLACEHOLDER_TESTIMONIALS[current].name}
                  </p>
                  <p className="text-sm text-[#9fb2c8]">
                    {PLACEHOLDER_TESTIMONIALS[current].location} ·{" "}
                    {PLACEHOLDER_TESTIMONIALS[current].service}
                  </p>
                </div>

                {/* Nav arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-orange-strong hover:border-orange-strong transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-orange-strong hover:border-orange-strong transition-all"
                    aria-label="Next review"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {PLACEHOLDER_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-orange-strong w-8"
                    : "bg-white/25 w-2 hover:bg-white/40"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
