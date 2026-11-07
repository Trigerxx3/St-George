import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BookOpen, ExternalLink, Calendar, Clock } from "lucide-react";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#071522] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Blog &amp; Knowledge Base Posts
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {BLOG_POSTS.length} educational articles published to capture search intent for solar and electrical topics in Canberra.
          </p>
        </div>
        <Link href="/blog" target="_blank" className="btn-primary !py-2 !px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md">
          <span>View Public Blog</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Article Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Read Time</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {BLOG_POSTS.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#071522] max-w-md">{p.title}</td>
                <td className="py-3.5 px-4 font-bold text-orange-strong">{p.category}</td>
                <td className="py-3.5 px-4 text-slate-400">{p.date}</td>
                <td className="py-3.5 px-4 text-slate-400">{p.readTime}</td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="text-orange-strong hover:text-orange-dark font-bold transition-colors"
                  >
                    View Live →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
