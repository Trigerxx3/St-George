"use client";

import { Phone, MessageCircle, FileText } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";
import Link from "next/link";

/**
 * Sticky bottom bar on mobile with Call, WhatsApp, and Get Quote buttons.
 * Only visible on screens < 768px (md breakpoint).
 */
export default function MobileFloatingBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy/95 backdrop-blur-sm border-t border-white/10 safe-area-bottom">
      <div className="grid grid-cols-3 h-14">
        {/* Call */}
        <a
          href={phoneHref(BUSINESS.phone)}
          className="flex flex-col items-center justify-center gap-0.5 text-white/80 hover:text-white active:bg-white/10 transition-colors"
          aria-label="Call us"
        >
          <Phone size={18} className="text-green" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={BUSINESS.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 text-white/80 hover:text-white active:bg-white/10 transition-colors"
          aria-label="Message us on WhatsApp"
        >
          <MessageCircle size={18} className="text-green" />
          <span className="text-[10px] font-medium uppercase tracking-wider">WhatsApp</span>
        </a>

        {/* Get Quote */}
        <Link
          href="/quote"
          className="flex flex-col items-center justify-center gap-0.5 bg-green text-white active:bg-green-dark transition-colors"
          aria-label="Get a free quote"
        >
          <FileText size={18} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Quote</span>
        </Link>
      </div>
    </div>
  );
}
