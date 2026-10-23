"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

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
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Customers{" "}
            <span className="text-green">Say</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Don't just take our word for it — hear from homeowners and businesses we've helped.
          </p>
          <p className="text-xs text-orange mt-2">
            [PLACEHOLDER REVIEWS — Replace with real Google Reviews]
          </p>
        </div>

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-off-white rounded-2xl p-8 sm:p-10 border border-gray-100">
            {/* Quote icon */}
            <Quote
              size={48}
              className="absolute top-6 left-6 text-green/10"
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
              <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 animate-fade-in">
                "{PLACEHOLDER_TESTIMONIALS[current].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy">
                    {PLACEHOLDER_TESTIMONIALS[current].name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {PLACEHOLDER_TESTIMONIALS[current].location} ·{" "}
                    {PLACEHOLDER_TESTIMONIALS[current].service}
                  </p>
                </div>

                {/* Nav arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all"
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current
                    ? "bg-green w-6"
                    : "bg-gray-300 hover:bg-gray-400"
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
