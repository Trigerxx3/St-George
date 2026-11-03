import Link from "next/link";
import { Phone, ArrowUpRight, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

interface ServiceCTAProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
}

/** Split "Ready to Upgrade Your Energy System?" so the last word carries the accent colour. */
function splitLastWord(text: string) {
  const idx = text.trimEnd().lastIndexOf(" ");
  if (idx === -1) return { head: "", tail: text };
  return { head: text.slice(0, idx + 1), tail: text.slice(idx + 1) };
}

/** Final CTA (dark): eyebrow, large heading with last word accent, one line of text, glowing pill, gradient divider. */
export default function ServiceCTA({
  title = "Ready to Upgrade Your Energy System?",
  subtitle = "Speak directly with our licensed team for an honest, obligation-free quotation tailored to your property.",
  primaryCtaText = "Request a Free Quote",
  primaryCtaHref = "/quote",
}: ServiceCTAProps) {
  const { head, tail } = splitLastWord(title);

  return (
    <section className="section-dark overflow-hidden">
      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4">Fast Response · Canberra &amp; Surrounds</span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl mb-5">
              {head}
              <span className="text-accent">{tail}</span>
            </h2>
            <p className="text-body-muted text-base sm:text-lg mb-6">{subtitle}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-body-muted">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange" /> ACT Licence #{BUSINESS.licence}
              </li>
              <li>Master Electricians Member</li>
              <li>No Obligation Free Estimate</li>
            </ul>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <Link href={primaryCtaHref} className="btn-pill-glow">
              {primaryCtaText}
              <ArrowUpRight size={20} />
            </Link>
            <a
              href={phoneHref(BUSINESS.phone)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-orange-light transition-colors"
            >
              <Phone size={16} className="text-orange" />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
      <div className="divider-glow" />
    </section>
  );
}
