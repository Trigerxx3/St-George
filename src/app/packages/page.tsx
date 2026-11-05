import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { PACKAGES } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Special Solar + Battery Packages & Prices Canberra | St George Electrical",
  description:
    "Lock in our special solar and battery prices for Canberra & ACT homes. 6.6kW + 14kWh ($6,799), 10.45kW + 28kWh ($10,999), and 13.3kW + 42kWh ($15,499).",
};

export default function PackagesPage() {
  return (
    <div className="section-light min-h-screen">
      <section className="section-dark py-16 lg:py-24">
        <div className="container-custom">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-red-400" /> Lock In Our Special Prices
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl mb-4 text-white">
            Special Solar + Battery
            <br />
            <span className="text-accent">Package Prices</span>
          </h1>
          <p className="text-body-muted text-base sm:text-lg max-w-2xl">
            Turnkey clean energy bundles engineered for Canberra homes and businesses. High-yield solar arrays paired with modular high-voltage home battery storage.
          </p>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="card card-hover flex flex-col justify-between relative overflow-hidden !border-orange-strong/30 shadow-xl"
            >
              {pkg.badge && (
                <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-navy-950/90 text-white text-xs font-bold rounded-full shadow-md backdrop-blur">
                  <Sparkles size={12} className="text-orange" /> {pkg.badge}
                </div>
              )}

              {pkg.image && (
                <div className="relative h-52 -mx-6 -mt-6 mb-5 overflow-hidden bg-gray-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                </div>
              )}

              <div>
                <span className="eyebrow mb-2 !text-orange-strong">{pkg.systemSize}</span>

                <h3 className="text-2xl sm:text-3xl text-ink font-bold mb-3">
                  {pkg.name}
                </h3>

                {pkg.price && (
                  <div className="mb-5 flex items-center justify-between bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-md">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider">Special Installed Price</span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight">{pkg.price}</span>
                  </div>
                )}

                <p className="text-body-muted text-sm leading-relaxed mb-6">
                  {pkg.shortDesc}
                </p>

                <div className="bg-off-white rounded-xl p-4 mb-6 border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Estimated Output:</span>
                    <span className="font-semibold text-ink text-right">{pkg.estimatedOutput}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Best Suited For:</span>
                    <span className="font-semibold text-ink text-right max-w-[200px]">{pkg.idealFor}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                    What&apos;s Included In This Package:
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {pkg.includedItems.slice(0, 5).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-orange-strong shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="btn-outline-dark !py-3 !px-4 text-xs font-bold text-center flex-1 rounded-xl"
                >
                  View Details &amp; Specs
                </Link>
                <Link
                  href={`/quote?package=${pkg.slug}`}
                  className="btn-primary !py-3 !px-5 text-xs flex-1"
                >
                  Request This Package <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="section-dark rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <Zap size={28} className="text-orange mx-auto mb-3" />
          <h3 className="text-2xl sm:text-3xl text-white mb-2">
            Need a Custom Sized Solar &amp; Battery <span className="text-accent">System?</span>
          </h3>
          <p className="text-body-muted text-sm mb-6 max-w-xl mx-auto">
            Every roof in Canberra is unique. We provide tailored solar and battery designs to match your specific roof orientation, shading, and energy profile.
          </p>
          <Link href="/quote" className="btn-primary !py-3.5 !px-7">
            Request Custom System Design <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
