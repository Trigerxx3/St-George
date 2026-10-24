import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, ChevronLeft } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalogue-data";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const currentCat = CATEGORIES.find((c) => c.slug === category);
  if (!currentCat) return { title: "Category Not Found" };

  return {
    title: `${currentCat.name} Installation & Supply Canberra | St George Electrical`,
    description: currentCat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const currentCat = CATEGORIES.find((c) => c.slug === category);

  if (!currentCat) {
    notFound();
  }

  const filteredProducts = PRODUCTS.filter((p) => p.categorySlug === category);

  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-green mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to All Products
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            Clean Energy Council Approved Standards
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {currentCat.name}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {currentCat.description}
          </p>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center flex-wrap gap-2 mb-10">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 hover:border-green/40 hover:text-green border border-gray-200 transition-colors"
          >
            All Products
          </Link>
          {CATEGORIES.map((cat) => {
            const isActive = cat.slug === category;
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-green text-white shadow-sm"
                    : "bg-white text-gray-700 hover:border-green/40 hover:text-green border border-gray-200"
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-lg mx-auto">
            <p className="text-gray-500 mb-4">No products currently listed in this category.</p>
            <Link href="/products" className="btn-primary !py-2.5 !px-5 text-sm">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card group hover:border-green/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Product Image */}
                  {product.images?.[0] && (
                    <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {product.categoryName}
                    </span>
                    {product.badge && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green bg-green/10 px-2.5 py-0.5 rounded-full">
                        <Sparkles size={12} /> {product.badge}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-xl font-bold text-navy mb-2 group-hover:text-green transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {product.shortDesc}
                  </p>

                  <div className="bg-off-white rounded-lg p-3 space-y-1.5 text-xs text-gray-700 mb-4 border border-gray-100">
                    {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-gray-400">{k}:</span>
                        <span className="font-semibold text-navy text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 mb-4 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-green flex-shrink-0" />
                    <span className="truncate">{product.warranty}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href={`/products/${product.categorySlug}/${product.slug}`}
                      className="text-center py-2 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Specs
                    </Link>
                    <Link
                      href={`/quote?service=${product.categorySlug}&product=${product.slug}`}
                      className="text-center py-2 px-3 rounded-lg bg-green text-white text-xs font-semibold hover:bg-green-dark transition-colors flex items-center justify-center gap-1"
                    >
                      Get Quote <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
