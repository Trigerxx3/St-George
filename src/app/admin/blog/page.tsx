import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BookOpen, ExternalLink, Calendar, Clock } from "lucide-react";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Blog &amp; Knowledge Base Posts
          </h1>
          <p className="text-gray-500 text-sm">
            {BLOG_POSTS.length} educational articles published to capture search intent for solar and electrical topics in Canberra.
          </p>
        </div>
        <Link href="/blog" target="_blank" className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
          <span>View Public Blog</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Article Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Read Time</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {BLOG_POSTS.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80">
                <td className="p-4 font-bold text-navy max-w-md">{p.title}</td>
                <td className="p-4 font-medium text-green">{p.category}</td>
                <td className="p-4 text-gray-400">{p.date}</td>
                <td className="p-4 text-gray-400">{p.readTime}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="text-green hover:underline font-semibold"
                  >
                    View Live
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
