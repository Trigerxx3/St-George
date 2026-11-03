import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck, Sparkles, ChevronLeft } from "lucide-react";
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
    <div className="section-light min-h-screen">
      <section className="section-dark py-14 lg:py-20">
        <div className="container-custom">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9fb2c8] hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={16} /> Back to All Products
          </Link>
          <div>
            <span className="eyebrow mb-3">Clean Energy Council Approved Standards</span>
            <h1 className="text-3xl sm:text-5xl text-white mb-3">{currentCat.name}</h1>
            <p className="text-body-muted text-base sm:text-lg max-w-2xl leading-relaxed">
              {currentCat.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        <div className="flex items-center flex-wrap gap-2 mb-10">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-700 hover:border-orange-strong/40 hover:text-orange-strong border border-gray-200 transition-colors"
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
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-orange-strong text-white shadow-sm"
                    : "bg-white text-gray-700 hover:border-orange-strong/40 hover:text-orange-strong border border-gray-200"
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

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
        )}
      </div>
    </div>
  );
}
