import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalogue-data";
import { PublicProductGrid } from "@/components/products/public-product-grid";

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

        {/* Products Grid */}
        <PublicProductGrid initialProducts={filteredProducts} categorySlug={category} />
      </div>
    </div>
  );
}
