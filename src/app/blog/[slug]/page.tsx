import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  Calendar,
  Phone,
} from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | St George Electrical`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="section-light min-h-screen py-14 lg:py-24">
      <div className="container-custom max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-strong mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to All Articles
        </Link>

        {/* Article Header */}
        <header className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
            <span className="font-bold text-orange-strong uppercase tracking-wider bg-orange/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {post.readTime}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-4xl lg:text-5xl text-ink font-extrabold tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div className="w-8 h-8 rounded-full bg-navy-950 text-orange-light border border-orange/30 flex items-center justify-center font-bold">
              SG
            </div>
            <div>
              <span className="font-bold text-ink block">{post.author}</span>
              <span className="text-gray-400">Licensed Electrical Contractor (ACT Licence #{BUSINESS.licence})</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg mb-12">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {/* Expert Callout Box */}
          <div className="bg-orange/5 border-l-4 border-orange p-5 rounded-r-xl my-8 text-sm text-gray-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <ShieldCheck size={18} className="text-orange-strong" />
              <span>Licensed Electrician Advice</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Have questions about your property&apos;s specific switchboard capacity or solar yield? St George Electrical provides obligation-free consultations across Canberra. Call us on{" "}
              <a href={phoneHref(BUSINESS.phone)} className="font-bold text-orange-strong hover:underline">
                {BUSINESS.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </article>

        {/* CTA Banner */}
        <div className="section-dark rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 shadow-2xl border-0">
          <div className="max-w-lg relative z-10">
            <h3
              className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to Upgrade Your <span className="text-orange-light">Electrical or Solar System?</span>
            </h3>
            <p className="text-white/70 text-sm">
              Get an honest, upfront quote with zero sales pressure from St George Electrical.
            </p>
          </div>
          <Link href="/quote" className="btn-primary !py-3.5 !px-7 flex-shrink-0 relative z-10">
            Request a Free Quote <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <h3
              className="text-2xl text-ink font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More Energy Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="card bg-white hover:border-orange/40 hover:shadow-lg transition-all"
                >
                  <span className="text-xs font-bold text-orange-strong uppercase tracking-wider block mb-1">
                    {rel.category}
                  </span>
                  <h4
                    className="text-lg font-bold text-ink mb-2 hover:text-orange-strong transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {rel.title}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">{rel.excerpt}</p>
                  <span className="link-arrow text-xs">
                    Read Article <span aria-hidden="true">↗</span>
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
