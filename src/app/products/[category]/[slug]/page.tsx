import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/catalogue-data";
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
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} Supply & Installation Canberra | St George Electrical`,
    description: product.shortDesc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug && p.categorySlug === category);

  if (!product) {
    notFound();
  }

  const related = PRODUCTS.filter(
    (p) => p.categorySlug === category && p.slug !== slug
  ).slice(0, 3);

  // Structured JSON-LD Product Schema
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
    <div className="bg-off-white min-h-screen py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/products" className="hover:text-green">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${category}`} className="hover:text-green capitalize">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Product Overview Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Real Product Showcase Image */}
            <div className="lg:col-span-5 bg-navy/5 rounded-xl border border-gray-200 overflow-hidden relative aspect-[4/3] group shadow-inner">
              <img
                src={product.images[0] || "/images/hero/hero-solar-home.jpg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {product.badge && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-bold text-white bg-navy/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                  <Sparkles size={12} className="text-orange" /> {product.badge}
                </div>
              )}
            </div>

            {/* Product Info & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
                  {product.categoryName}
                </div>
                <h1
                  className="text-2xl sm:text-4xl text-navy mb-4 font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {product.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Warranty Callout */}
                <div className="p-4 bg-green/5 rounded-xl border border-green/20 mb-8 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                      Warranty &amp; Installation Guarantee
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">{product.warranty}</p>
                  </div>
                </div>
              </div>

              {/* Conversion Buttons */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/quote?service=${product.categorySlug}&product=${product.slug}`}
                    className="btn-primary !py-3.5 !px-8 text-base justify-center flex-1"
                  >
                    Request a Quote For This
                    <ArrowRight size={18} />
                  </Link>
                  <a
                    href={phoneHref(BUSINESS.phone)}
                    className="btn-outline !py-3.5 !px-6 text-base justify-center"
                  >
                    <Phone size={18} />
                    Call Justin
                  </a>
                </div>
                <p className="text-xs text-center sm:text-left text-gray-400">
                  ⚡ Installed by ACT Licensed Electrician Justin George (Licence #{BUSINESS.licence})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-12">
          <h2
            className="text-2xl sm:text-3xl text-navy mb-6 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Technical Specifications
          </h2>

          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {Object.entries(product.specs).map(([specKey, specVal]) => (
              <div key={specKey} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <span className="font-semibold text-gray-500">{specKey}</span>
                <span className="sm:col-span-2 text-navy font-medium">{specVal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h3
              className="text-2xl text-navy mb-6 font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Related {product.categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.categorySlug}/${rel.slug}`}
                  className="card group hover:border-green/40 hover:shadow-lg transition-all"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    {rel.categoryName}
                  </span>
                  <h4
                    className="text-lg font-bold text-navy mb-2 group-hover:text-green transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {rel.name}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">{rel.shortDesc}</p>
                  <span className="text-xs font-bold text-green inline-flex items-center gap-1">
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
