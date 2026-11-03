import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Zap,
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
    <div className="section-light min-h-screen py-10 lg:py-16">
      <div className="container-custom">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/packages" className="hover:text-orange-strong">
            Packages
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold truncate max-w-[250px] sm:max-w-none">
            {pkg.name}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <span className="eyebrow mb-3 !text-orange-strong">
                {pkg.systemSize} · ACT Scheme Eligible
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-ink mb-4">
                {pkg.name}
              </h1>
              <p className="text-body-muted text-base sm:text-lg leading-relaxed mb-6">
                {pkg.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-off-white p-4 rounded-xl border border-gray-100 mb-8 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Estimated Daily Generation</span>
                  <span className="text-sm font-bold text-ink">{pkg.estimatedOutput}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Recommended Property</span>
                  <span className="text-sm font-bold text-ink">{pkg.idealFor}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-ink mb-4">
                  Turnkey Package Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.includedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-off-white border border-gray-100 text-xs text-gray-700"
                    >
                      <CheckCircle2 size={16} className="text-orange-strong shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl text-ink mb-4">
                  Key System Advantages
                </h3>
                <ul className="space-y-2.5 text-sm text-body-muted">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Zap size={16} className="text-orange-strong shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {pkg.image && (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-video bg-gray-100">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="section-dark p-6 sm:p-8 rounded-2xl shadow-xl">
                <span className="eyebrow mb-2">Get a Fixed Upfront Quote</span>
                <h3 className="text-2xl text-white mb-2">Request This Package</h3>
                <p className="text-xs text-[#9fb2c8] mb-6 leading-relaxed">
                  We will assess your roof via satellite imagery, review your switchboard, and calculate your exact savings.
                </p>

                <div className="space-y-3 mb-6">
                  <Link
                    href={`/quote?package=${pkg.slug}`}
                    className="btn-primary w-full !py-3.5 text-sm"
                  >
                    Request This Package <ArrowUpRight size={16} />
                  </Link>
                  <a
                    href={phoneHref(BUSINESS.phone)}
                    className="btn-outline w-full !py-3.5 text-sm"
                  >
                    <Phone size={16} />
                    Call {BUSINESS.phoneDisplay}
                  </a>
                </div>

                <div className="pt-5 border-t-0 text-xs text-[#9fb2c8] space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-orange" />
                    <span>{pkg.warrantySummary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-orange" />
                    <span>ACT Licence #{BUSINESS.licence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {otherPackages.length > 0 && (
          <div>
            <h3 className="text-2xl text-ink mb-6">
              Compare Other Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPackages.map((other) => (
                <div key={other.id} className="card card-hover flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-orange-strong uppercase tracking-[0.14em] block mb-1">
                      {other.systemSize}
                    </span>
                    <h4 className="text-xl text-ink mb-2">
                      {other.name}
                    </h4>
                    <p className="text-body-muted text-xs line-clamp-2 mb-4">{other.shortDesc}</p>
                  </div>
                  <Link href={`/packages/${other.slug}`} className="link-arrow text-xs">
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
