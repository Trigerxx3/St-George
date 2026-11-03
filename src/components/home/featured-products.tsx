import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Reveal from "@/components/ui/reveal";

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
    <section className="section-light section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="07 — Products"
          line1="Featured"
          line2="Products"
          intro="Quality brands and equipment, professionally installed."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLACEHOLDER_PRODUCTS.map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover group">
                <div className="placeholder-image aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                  <div className="text-center text-gray-500">
                    <Package size={40} strokeWidth={1} className="mx-auto mb-2 opacity-60" />
                    <p className="text-xs">[Product Photo]</p>
                  </div>
                </div>

                <div className="p-5">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.12em] text-orange-strong mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-lg text-ink mb-2 group-hover:text-orange-strong transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-body-muted mb-4 line-clamp-2">{product.shortDesc}</p>
                  <Link href={`/products/${product.categorySlug}/${product.slug}`} className="link-arrow">
                    View Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/products" className="link-arrow">
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
