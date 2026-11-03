import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { PACKAGES } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Solar & Battery Packages Canberra | Turnkey Clean Energy Bundles",
  description:
    "Complete residential and commercial solar packages with Tier-1 panels, smart inverters, and battery storage. Licensed installation across Canberra & ACT.",
};

export default function PackagesPage() {
  return (
    <div className="section-light min-h-screen">
      <section className="section-dark py-16 lg:py-24">
        <div className="container-custom">
          <span className="eyebrow mb-4">ACT Sustainable Household Scheme Eligible Bundles</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl mb-4">
            Solar &amp; Energy
            <br />
            <span className="text-accent">Packages</span>
          </h1>
          <p className="text-body-muted text-base sm:text-lg max-w-2xl">
            Turnkey energy solutions designed for Canberra homes and businesses. Fully installed with zero hidden fees.
          </p>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`card card-hover flex flex-col justify-between relative overflow-hidden ${
                pkg.featured ? "!border-orange-strong/50 shadow-xl" : ""
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-orange-strong text-white text-xs font-bold rounded-full shadow-md">
                  <Sparkles size={12} /> Canberra Top Pick
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
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                </div>
              )}

              <div>
                <span className="eyebrow mb-2 !text-orange-strong">{pkg.systemSize}</span>

                <h3 className="text-2xl sm:text-3xl text-ink mb-3">
                  {pkg.name}
                </h3>

                <p className="text-body-muted text-sm leading-relaxed mb-6">
                  {pkg.shortDesc}
                </p>

                <div className="bg-off-white rounded-xl p-4 mb-6 border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Estimated Output:</span>
                    <span className="font-semibold text-ink">{pkg.estimatedOutput}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Best Suited For:</span>
                    <span className="font-semibold text-ink text-right max-w-[220px]">{pkg.idealFor}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                    What&apos;s Included In This Package:
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {pkg.includedItems.slice(0, 4).map((item, idx) => (
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
