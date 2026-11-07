"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductItem } from "@/types/catalogue";

interface Props {
  initialProducts: ProductItem[];
  categorySlug?: string;
}

export function PublicProductGrid({ initialProducts, categorySlug }: Props) {
  const [products, setProducts] = useState<ProductItem[]>(
    initialProducts.filter((p) => p.isActive !== false)
  );

  useEffect(() => {
    try {
      const cached = localStorage.getItem("stg_admin_products");
      if (cached) {
        const parsed: ProductItem[] = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((p) => {
            const matchesCat = categorySlug ? p.categorySlug === categorySlug : true;
            const isLive = p.isActive !== false;
            return matchesCat && isLive;
          });
          setProducts(filtered);
          return;
        }
      }
    } catch {}
  }, [categorySlug]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="font-semibold text-lg text-ink">No active products currently found in this category.</p>
        <p className="text-sm mt-1">Please check back soon or contact our Canberra team for custom hardware inquiries.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {products.map((product) => (
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/products/solar-panel.jpg";
                  }}
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

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="bg-off-white rounded-xl p-3.5 space-y-1.5 text-xs text-gray-700 mb-4 border border-gray-100">
                {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-gray-500">{k}:</span>
                    <span className="font-semibold text-ink text-right">{v}</span>
                  </div>
                ))}
              </div>
            )}
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
  );
}

