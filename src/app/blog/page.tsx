import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, User, ShieldCheck } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Electrical & Solar Blog Canberra | St George Electrical Insights",
  description:
    "Expert electrical advice, ACT solar rebate guides, EV charging tips, and switchboard safety recommendations from St George Electrical Energy Solutions.",
};

export default function BlogPage() {
  return (
    <div className="section-light min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="eyebrow mb-3 !text-orange-strong">
            Expert Guides &amp; Canberra Electrical Advice
          </span>
          <h1 className="text-3xl sm:text-5xl text-ink mb-4">
            Insights &amp; <span className="text-accent">Energy Guides</span>
          </h1>
          <p className="text-body-muted text-base sm:text-lg">
            Practical advice on solar efficiency, EV home charging, government rebates, and electrical safety in the ACT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="card card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-orange-strong uppercase tracking-wider bg-orange/10 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={13} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-2xl text-ink mb-3 hover:text-orange-strong transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-body-muted text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User size={14} className="text-gray-400" />
                  <span>By {post.author}</span>
                </div>

                <Link href={`/blog/${post.slug}`} className="link-arrow text-xs">
                  Read Full Guide <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="section-dark rounded-3xl p-8 sm:p-10 text-white text-center max-w-3xl mx-auto shadow-xl">
          <h3 className="text-2xl sm:text-3xl text-white mb-3">
            Need Advice for Your <span className="text-accent">Property?</span>
          </h3>
          <p className="text-[#9fb2c8] text-sm mb-6 max-w-xl mx-auto">
            Contact St George Electrical directly for tailored advice on solar design, EV charging, or switchboard safety.
          </p>
          <Link href="/quote" className="btn-primary !py-3 !px-7">
            Request an Obligation-Free Quote <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
