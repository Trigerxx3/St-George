import type { Metadata } from "next";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client Testimonials & Reviews | St George Electrical Canberra",
  description:
    "Read real feedback from Canberra homeowners and businesses who trusted Justin George at St George Electrical for their solar, battery, EV, and electrical work.",
};

const REVIEWS = [
  {
    name: "Michael Henderson",
    location: "Gungahlin, ACT",
    service: "10kW Solar & Tesla Powerwall 3",
    rating: 5,
    date: "Verified Customer · 2025",
    content:
      "Justin George did an exceptional job installing our 10kW solar system and Tesla Powerwall 3. From the initial quote through to EvoEnergy connection, everything was handled cleanly and professionally. Our first quarterly bill arrived and we are virtually off the grid. Highly recommend Justin to any Canberra homeowner.",
  },
  {
    name: "Sarah & Peter Campbell",
    location: "Belconnen, ACT",
    service: "Switchboard Upgrade & Safety Switches",
    rating: 5,
    date: "Verified Customer · 2025",
    content:
      "Our older home in Belconnen still had ancient ceramic fuses that kept tripping. Justin replaced the entire switchboard with modern RCBO safety switches, removed the asbestos panel safely, and issued our ACT compliance certificate. Polite, on time, and left the work area spotless.",
  },
  {
    name: "James Thornton",
    location: "Kingston, ACT",
    service: "Tesla Wall Connector EV Charger",
    rating: 5,
    date: "Verified Customer · 2025",
    content:
      "Bought a Model Y and needed a dedicated fast charger installed in our garage. Justin assessed our supply, ran a dedicated 32A line with Type B protection, and had everything running within half a day. Charging is super fast and clean. Great communication throughout.",
  },
  {
    name: "David O'Connor",
    location: "Queanbeyan, NSW",
    service: "6.6kW Rooftop Solar Installation",
    rating: 5,
    date: "Verified Customer · 2024",
    content:
      "Honest advice with zero high-pressure sales tactics. Justin explained the difference between panels, applied the Federal STC discount upfront, and delivered high quality workmanship. Couldn't be happier with our solar investment.",
  },
  {
    name: "Rebecca Mills",
    location: "Woden, ACT",
    service: "Whole-Home LED Downlight Retrofit & Smoke Alarms",
    rating: 5,
    date: "Verified Customer · 2024",
    content:
      "St George Electrical upgraded all the old halogen downlights in our home to modern warm-white LEDs and installed interconnected photoelectric smoke alarms for rental compliance. Quick, tidy, and reasonable pricing.",
  },
  {
    name: "Marcus Leung",
    location: "Fyshwick, ACT",
    service: "Commercial Distribution Board & Fitout",
    rating: 5,
    date: "Verified Customer · 2024",
    content:
      "We needed three-phase power reticulation and sub-boards installed for our new commercial warehouse. Justin worked over the weekend so our dispatch schedule wouldn't be interrupted. Professional electrician with great industrial knowledge.",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            100% Verified ACT &amp; NSW Client Reviews
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Canberra Clients Say
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Real feedback from local residents and business owners who rely on St George Electrical Energy Solutions.
          </p>
        </div>

        {/* Rating Trust Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-2xl mx-auto mb-14 text-center shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6">
          <div>
            <div className="text-4xl font-extrabold text-navy font-mono mb-1">5.0 / 5.0</div>
            <div className="flex items-center justify-center gap-1 text-orange mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">Customer Satisfaction Score</span>
          </div>

          <div className="hidden sm:block w-px h-16 bg-gray-200" />

          <div>
            <div className="text-4xl font-extrabold text-green font-mono mb-1">100%</div>
            <span className="text-xs text-gray-500 font-medium block">ACT Licensed &amp; Insured</span>
            <span className="text-[11px] text-gray-400">Licence #{BUSINESS.licence}</span>
          </div>

          <div className="hidden sm:block w-px h-16 bg-gray-200" />

          <div>
            <div className="text-4xl font-extrabold text-navy font-mono mb-1">0</div>
            <span className="text-xs text-gray-500 font-medium block">Middlemen or Call Centres</span>
            <span className="text-[11px] text-gray-400">Direct Electrician Service</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="card bg-white hover:border-green/40 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-orange">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-navy text-sm">{rev.name}</h3>
                    <span className="text-xs text-gray-400">{rev.location}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full">
                    {rev.service.split("&")[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-navy rounded-2xl p-8 sm:p-10 text-white text-center max-w-3xl mx-auto shadow-xl">
          <h3
            className="text-2xl sm:text-3xl text-white mb-3 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Experience the St George Electrical Difference
          </h3>
          <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
            Get an honest, obligation-free quote directly from Justin George.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote" className="btn-primary !py-3 !px-7">
              Request Your Free Quote <ArrowRight size={16} />
            </Link>
            <a href={phoneHref(BUSINESS.phone)} className="btn-outline !py-3 !px-7">
              <Phone size={16} /> Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
