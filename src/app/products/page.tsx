import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalogue-data";

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
            All Products ({PRODUCTS.length})
          </Link>
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 hover:border-orange-strong/40 hover:text-orange-strong border border-gray-200 transition-colors"
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="card card-hover group flex flex-col justify-between overflow-hidden"
            >
              <div>
                {product.images?.[0] && (
                  <div className="relative h-48 -mx-6 -mt-6 mb-5 overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-orange-strong uppercase tracking-[0.14em]">
                    {product.categoryName}
                  </span>
                  {product.badge && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-strong bg-orange/10 px-2.5 py-0.5 rounded-full">
                      <Sparkles size={12} /> {product.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl text-ink mb-2 group-hover:text-orange-strong transition-colors">
                  {product.name}
                </h3>

                <p className="text-body-muted text-xs sm:text-sm leading-relaxed mb-4">
                  {product.shortDesc}
                </p>

                <div className="bg-off-white rounded-xl p-3.5 space-y-1.5 text-xs text-gray-700 mb-4 border border-gray-100">
                  {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-gray-500">{k}:</span>
                      <span className="font-semibold text-ink text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] text-gray-500 mb-4 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-orange-strong shrink-0" />
                  <span className="truncate">{product.warranty}</span>
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100">
                  <Link
                    href={`/products/${product.categorySlug}/${product.slug}`}
                    className="btn-outline-dark !py-2.5 !px-3 !text-xs"
                  >
                    View Specs
                  </Link>
                  <Link
                    href={`/quote?service=${product.categorySlug}&product=${product.slug}`}
                    className="btn-primary !py-2.5 !px-3 !text-xs"
                  >
                    Get Quote <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
