import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES, PACKAGES } from "@/lib/catalogue-data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SERVICE_AREAS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stgeorgeelectrical.com.au";
  const now = new Date();

  const staticRoutes = [
    "",
    "/solar-battery",
    "/ev-chargers",
    "/electrical",
    "/domestic",
    "/commercial",
    "/industrial",
    "/products",
    "/packages",
    "/quote",
    "/booking",
    "/calculator",
    "/ev-selector",
    "/rebates",
    "/gallery",
    "/testimonials",
    "/faq",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/warranty",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route.startsWith("/quote") || route.startsWith("/solar") ? 0.9 : 0.8,
  }));

  // Category pages
  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${baseUrl}/products/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Product pages
  const productRoutes = PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.categorySlug}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // Package pages
  const packageRoutes = PACKAGES.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Blog posts
  const blogRoutes = BLOG_POSTS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Service areas
  const areaRoutes = SERVICE_AREAS.map((a) => ({
    url: `${baseUrl}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...packageRoutes,
    ...blogRoutes,
    ...areaRoutes,
  ];
}
