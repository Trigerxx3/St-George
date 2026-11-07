import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Phone,
  Sparkles,
} from "lucide-react";
import { PRODUCTS } from "@/lib/catalogue-data";
import { getStoredProducts } from "@/lib/products-store";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((prod) => ({
    category: prod.categorySlug,
    slug: prod.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allProducts = getStoredProducts();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} Supply & Installation Canberra | St George Electrical`,
    description: product.shortDesc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const allProducts = getStoredProducts();
  const product = allProducts.find((p) => p.slug === slug && p.categorySlug === category);

  if (!product) {
    notFound();
  }

  const related = allProducts.filter(
    (p) => p.categorySlug === category && p.slug !== slug && p.isActive !== false
  ).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.name.split(" ")[0],
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: BUSINESS.name,
      },
    },
  };

  return (
    <div className="section-light min-h-screen py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/products" className="hover:text-orange-strong">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${category}`} className="hover:text-orange-strong capitalize">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Product Overview Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 bg-navy/5 rounded-2xl border border-gray-200 overflow-hidden relative aspect-[4/3] group">
              <img
                src={product.images[0] || "/images/hero/hero-solar-home.jpg"}
                alt={product.name}
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent pointer-events-none" />

              {product.badge && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-bold text-white bg-navy-950/85 backdrop-blur-md px-3 py-1 rounded-full border-0 shadow-md">
                  <Sparkles size={12} className="text-orange" /> {product.badge}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <span className="eyebrow mb-3 !text-orange-strong">{product.categoryName}</span>
                <h1 className="text-2xl sm:text-4xl text-ink mb-4">
                  {product.name}
                </h1>
                <p className="text-body-muted text-sm sm:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="p-4 bg-orange/5 rounded-xl border border-orange-strong/20 mb-8 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-orange-strong shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-ink uppercase tracking-wider">
                      Warranty &amp; Installation Guarantee
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">{product.warranty}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/quote?service=${product.categorySlug}&product=${product.slug}`}
                    className="btn-primary !py-3.5 !px-8 text-base flex-1"
                  >
                    Request a Quote For This
                    <ArrowUpRight size={18} />
                  </Link>
                  <a
                    href={phoneHref(BUSINESS.phone)}
                    className="btn-outline-dark !py-3.5 !px-6 text-base inline-flex items-center justify-center gap-2 rounded-xl font-bold"
                  >
                    <Phone size={18} className="text-orange-strong" />
                    Call Us
                  </a>
                </div>
                <p className="text-xs text-center sm:text-left text-gray-500">
                  Installed by {BUSINESS.name} (ACT Licence #{BUSINESS.licence})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table (Dark Glass Panel) */}
        <div className="section-dark rounded-3xl p-6 sm:p-10 mb-12">
          <span className="eyebrow mb-2">Datasheet Summary</span>
          <h2 className="text-2xl sm:text-3xl text-white mb-6">
            Technical <span className="text-accent">Specifications</span>
          </h2>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {Object.entries(product.specs).map(([specKey, specVal]) => (
              <div key={specKey} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <span className="font-semibold text-[#9fb2c8]">{specKey}</span>
                <span className="sm:col-span-2 text-white font-semibold">{specVal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h3 className="text-2xl text-ink mb-6">
              Related {product.categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.categorySlug}/${rel.slug}`}
                  className="card card-hover group"
                >
                  <span className="text-xs font-extrabold text-orange-strong uppercase tracking-[0.14em] block mb-1">
                    {rel.categoryName}
                  </span>
                  <h4 className="text-lg text-ink mb-2 group-hover:text-orange-strong transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-body-muted text-xs line-clamp-2 mb-4">{rel.shortDesc}</p>
                  <span className="link-arrow text-xs">
                    View Details <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
