import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalogue-data";
import { PublicProductGrid } from "@/components/products/public-product-grid";

export const metadata: Metadata = {
  title: "Product Catalogue | Solar, Batteries, EV Chargers | St George Electrical",
  description:
    "Explore premium solar panels, home batteries, smart inverters, and EV chargers supplied and installed by St George Electrical Energy Solutions.",
};

export default function ProductsPage() {
  return (
    <div className="section-light min-h-screen">
      {/* Dark Header Band */}
      <section className="section-dark py-16 lg:py-24">
        <div className="container-custom">
          <span className="eyebrow mb-4">Tier-1 Manufacturers Only · Australian Warranty Backed</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl mb-4">
            Clean Energy
            <br />
            <span className="text-accent">Product Catalogue</span>
          </h1>
          <p className="text-body-muted text-base sm:text-lg max-w-2xl">
            We only supply and install trusted equipment from world-leading manufacturers proven in Australia&apos;s demanding climate.
          </p>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        {/* Category Pills Navigation */}
        <div className="flex items-center flex-wrap gap-2 mb-12">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-sm font-bold bg-orange-strong text-white shadow-sm"
          >
            All Products
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 hover:border-orange-strong/40 hover:text-orange-strong border border-gray-200 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Products Grid (Client-hydrated for live admin enable/disable & add) */}
        <PublicProductGrid initialProducts={PRODUCTS} />

        {/* Packages Teaser Banner */}
        <div className="section-dark rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow mb-3">Bundled Value Packages</span>
            <h3 className="text-2xl sm:text-3xl text-white mb-2">
              Looking for Complete Solar &amp; Battery <span className="text-accent">Bundles?</span>
            </h3>
            <p className="text-body-muted text-sm">
              Explore our turnkey packages engineered specifically for Canberra homes, with all panels, inverters, batteries, and installation included.
            </p>
          </div>
          <Link href="/packages" className="btn-primary !py-3.5 !px-7 shrink-0">
            View All Packages <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
