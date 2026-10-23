import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

/* ─── Placeholder products (will be replaced with DB data in Phase 3) ─── */
const PLACEHOLDER_PRODUCTS = [
  {
    name: "Premium Solar Panel",
    category: "Solar Panels",
    shortDesc: "High-efficiency monocrystalline panel for residential & commercial use.",
    slug: "premium-solar-panel",
    categorySlug: "solar-panels",
  },
  {
    name: "Home Battery System",
    category: "Batteries",
    shortDesc: "Store solar energy and power your home day and night.",
    slug: "home-battery-system",
    categorySlug: "batteries",
  },
  {
    name: "Hybrid Inverter",
    category: "Inverters",
    shortDesc: "Smart hybrid inverter for solar + battery integration.",
    slug: "hybrid-inverter",
    categorySlug: "inverters",
  },
  {
    name: "Smart EV Charger",
    category: "EV Chargers",
    shortDesc: "Level 2 smart charger with app control and solar integration.",
    slug: "smart-ev-charger",
    categorySlug: "ev-chargers",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2
              className="text-3xl sm:text-4xl text-navy mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Featured <span className="text-green">Products</span>
            </h2>
            <p className="text-gray-500 max-w-md">
              Quality brands and equipment, professionally installed.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-green font-semibold text-sm hover:text-green-dark transition-colors group"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <div
              key={product.slug}
              className="bg-off-white rounded-xl border border-gray-100 overflow-hidden card-hover group"
            >
              {/* Image placeholder */}
              <div className="placeholder-image aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                <div className="text-center text-gray-400">
                  <Package size={40} strokeWidth={1} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">[Product Photo]</p>
                </div>
              </div>

              <div className="p-5">
                <span className="inline-block text-xs font-semibold text-green bg-green/10 px-2 py-0.5 rounded-full mb-2">
                  {product.category}
                </span>
                <h3
                  className="text-lg text-navy mb-2 group-hover:text-green transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {product.shortDesc}
                </p>
                <Link
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-green transition-colors group/link"
                >
                  View Details
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
