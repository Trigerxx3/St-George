import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, User, ShieldCheck } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Electrical & Solar Blog Canberra | St George Electrical Insights",
  description:
    "Expert electrical advice, ACT solar rebate guides, EV charging tips, and switchboard safety recommendations from licensed Canberra electrician Justin George.",
};

export default function BlogPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <BookOpen size={14} />
            Expert Guides &amp; Canberra Electrical Advice
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Insights &amp; Energy Guides
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Practical advice on solar efficiency, EV home charging, government rebates, and electrical safety in the ACT.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="card bg-white hover:border-green/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-green uppercase tracking-wider bg-green/10 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={13} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2
                  className="text-2xl text-navy font-bold mb-3 hover:text-green transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User size={14} className="text-gray-400" />
                  <span>By {post.author}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green hover:underline"
                >
                  Read Full Guide <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-navy rounded-2xl p-8 sm:p-10 text-white text-center max-w-3xl mx-auto shadow-xl">
          <h3
            className="text-2xl sm:text-3xl text-white mb-3 font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need Advice for Your Property?
          </h3>
          <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
            Contact Justin George directly for tailored advice on solar design, EV charging, or switchboard safety.
          </p>
          <Link href="/quote" className="btn-primary !py-3 !px-7">
            Request an Obligation-Free Quote <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
