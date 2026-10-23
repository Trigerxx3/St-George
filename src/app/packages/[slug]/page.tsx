import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Zap,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { PACKAGES } from "@/lib/catalogue-data";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PACKAGES.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = PACKAGES.find((p) => p.slug === slug);
  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `${pkg.name} | St George Electrical Energy Solutions`,
    description: pkg.shortDesc,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = PACKAGES.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  const otherPackages = PACKAGES.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-off-white min-h-screen py-10 lg:py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/packages" className="hover:text-green">
            Packages
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold truncate max-w-[250px] sm:max-w-none">
            {pkg.name}
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
                <ShieldCheck size={14} />
                {pkg.systemSize} · ACT Schemed Eligible
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4 font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {pkg.name}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                {pkg.description}
              </p>

              {/* Specs pill row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-off-white p-4 rounded-xl border border-gray-100 mb-8 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Estimated Daily Generation</span>
                  <span className="text-sm font-bold text-navy">{pkg.estimatedOutput}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Recommended Property</span>
                  <span className="text-sm font-bold text-navy">{pkg.idealFor}</span>
                </div>
              </div>

              {/* What's included */}
              <div className="mb-8">
                <h3
                  className="text-xl font-bold text-navy mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Turnkey Package Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.includedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-green flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3
                  className="text-xl font-bold text-navy mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Key System Advantages
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Zap size={16} className="text-orange flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Sticky Card: Quote & Call Box */}
            <div className="lg:col-span-4 bg-navy text-white p-6 sm:p-8 rounded-2xl sticky top-28 shadow-xl">
              <span className="inline-block text-xs font-bold text-green-light uppercase tracking-wider mb-2">
                Get a Fixed Upfront Quote
              </span>
              <h3
                className="text-2xl text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Request This Package
              </h3>
              <p className="text-xs text-white/70 mb-6 leading-relaxed">
                We will assess your roof via satellite imagery, review your switchboard, and calculate your exact savings.
              </p>

              <div className="space-y-3 mb-6">
                <Link
                  href={`/quote?package=${pkg.slug}`}
                  className="btn-primary w-full !py-3.5 text-sm text-center justify-center flex"
                >
                  Request This Package <ArrowRight size={16} />
                </Link>
                <a
                  href={phoneHref(BUSINESS.phone)}
                  className="btn-outline w-full !py-3.5 text-sm text-center justify-center flex"
                >
                  <Phone size={16} />
                  Call {BUSINESS.phoneDisplay}
                </a>
              </div>

              <div className="pt-5 border-t border-white/10 text-xs text-white/60 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green" />
                  <span>{pkg.warrantySummary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green" />
                  <span>ACT Licence #{BUSINESS.licence}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Packages */}
        {otherPackages.length > 0 && (
          <div>
            <h3
              className="text-2xl text-navy mb-6 font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Compare Other Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPackages.map((other) => (
                <div key={other.id} className="card bg-white flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-navy/60 block mb-1">
                      {other.systemSize}
                    </span>
                    <h4
                      className="text-xl font-bold text-navy mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {other.name}
                    </h4>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-4">{other.shortDesc}</p>
                  </div>
                  <Link
                    href={`/packages/${other.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green hover:underline"
                  >
                    View Package Details <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
