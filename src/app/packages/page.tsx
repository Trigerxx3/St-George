import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { PACKAGES } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Solar & Battery Packages Canberra | Turnkey Clean Energy Bundles",
  description:
    "Complete residential and commercial solar packages with Tier-1 panels, smart inverters, and battery storage. Licensed installation across Canberra & ACT.",
};

export default function PackagesPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            ACT Sustainable Household Scheme Eligible Bundles
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Solar &amp; Energy Packages
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Turnkey energy solutions designed for Canberra homes and businesses. Fully installed with zero hidden fees.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`card flex flex-col justify-between transition-all duration-300 relative ${
                pkg.featured
                  ? "border-green/40 shadow-xl bg-white"
                  : "border-gray-200 hover:shadow-lg bg-white"
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 px-3 py-1 bg-green text-white text-xs font-bold rounded-full shadow-sm">
                  <Sparkles size={12} /> Canberra Top Pick
                </div>
              )}

              <div>
                <div className="inline-block px-3 py-1 bg-navy/5 text-navy rounded-md text-xs font-bold mb-3">
                  {pkg.systemSize}
                </div>

                <h3
                  className="text-2xl sm:text-3xl text-navy mb-3 font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pkg.name}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {pkg.shortDesc}
                </p>

                {/* Key specs highlight */}
                <div className="bg-off-white rounded-xl p-4 mb-6 border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Output:</span>
                    <span className="font-semibold text-navy">{pkg.estimatedOutput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Best Suited For:</span>
                    <span className="font-semibold text-navy text-right max-w-[220px]">{pkg.idealFor}</span>
                  </div>
                </div>

                {/* Included Items List */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    What&apos;s Included In This Package:
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {pkg.includedItems.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-green flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="btn-outline !py-3 !px-4 text-xs font-semibold text-center flex-1 justify-center"
                  >
                    View Details &amp; Specs
                  </Link>
                  <Link
                    href={`/quote?package=${pkg.slug}`}
                    className="btn-primary !py-3 !px-5 text-xs font-semibold text-center flex-1 justify-center"
                  >
                    Request This Package <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Solution Note */}
        <div className="card p-8 bg-white border border-gray-200 text-center max-w-3xl mx-auto">
          <Zap size={28} className="text-green mx-auto mb-3" />
          <h3
            className="text-2xl text-navy mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need a Custom Sized Solar &amp; Battery System?
          </h3>
          <p className="text-gray-600 text-sm mb-6 max-w-xl mx-auto">
            Every roof in Canberra is unique. We provide tailored solar and battery designs to match your specific roof orientation, shading, and energy profile.
          </p>
          <Link href="/quote" className="btn-primary !py-3 !px-7">
            Request Custom System Design
          </Link>
        </div>
      </div>
    </div>
  );
}
