import Link from "next/link";
import { PACKAGES } from "@/lib/catalogue-data";
import { Package, ExternalLink } from "lucide-react";

export default function AdminPackagesPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Turnkey Clean Energy Packages
          </h1>
          <p className="text-gray-500 text-sm">
            {PACKAGES.length} packages configured for Canberra residential &amp; commercial properties.
          </p>
        </div>
        <Link href="/packages" target="_blank" className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
          <span>View Public Packages</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green uppercase tracking-wider">{pkg.systemSize}</span>
                <span className="text-[10px] font-bold bg-green/10 text-green px-2 py-0.5 rounded-full">Active</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">{pkg.name}</h3>
              <p className="text-gray-500 text-xs mb-4">{pkg.shortDesc}</p>
              <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1 mb-4">
                <div><strong>Daily Gen:</strong> {pkg.estimatedOutput}</div>
                <div><strong>Best For:</strong> {pkg.idealFor}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <Link
                href={`/packages/${pkg.slug}`}
                target="_blank"
                className="text-xs font-bold text-green hover:underline inline-flex items-center gap-1"
              >
                View Live Page <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
