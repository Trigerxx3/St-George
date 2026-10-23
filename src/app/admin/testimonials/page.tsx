import Link from "next/link";
import { Star, MessageSquareQuote, ExternalLink } from "lucide-react";

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Client Reviews &amp; Testimonials
          </h1>
          <p className="text-gray-500 text-sm">
            Curated verified customer reviews displayed on homepage and testimonials page.
          </p>
        </div>
        <Link href="/testimonials" target="_blank" className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
          <span>View Public Page</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-green font-bold text-sm">
          <Star size={16} fill="currentColor" />
          <span>5.0 Star Average Across All Verified Canberra Installations</span>
        </div>
        <p className="text-gray-600 text-xs">
          All client reviews are checked and attributed to real Canberra suburbs to maintain authenticity and local trust.
        </p>
      </div>
    </div>
  );
}
