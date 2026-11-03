import Link from "next/link";
import { Phone, ArrowUpRight, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";
import WireLine from "@/components/ui/wire-line";

interface ServiceHeroProps {
  title: string;
  tagline?: string;
  description: string;
  badge?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

function splitHeading(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return { line1: text, line2: "" };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}

export default function ServiceHero({
  title,
  tagline,
  description,
  badge = `ACT Licence #${BUSINESS.licence} · Licensed & Insured`,
  primaryCtaText = "Request a Free Quote",
  primaryCtaHref = "/quote",
  imageSrc,
  imageAlt,
}: ServiceHeroProps) {
  const { line1, line2 } = splitHeading(title);

  return (
    <section className="section-dark relative overflow-hidden">
      <WireLine className="left-0 right-0 bottom-0 w-full h-36 opacity-75" variant="sweep" />

      <div className="container-custom relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className={imageSrc ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center" : "max-w-3xl"}>
          <div className={imageSrc ? "lg:col-span-7" : ""}>
            <span className="eyebrow mb-5">{badge}</span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl leading-[1.08] mb-4">
              {line1}
              {line2 && (
                <>
                  <br />
                  <span className="text-accent">{line2}</span>
                </>
              )}
            </h1>

            {tagline && (
              <p className="text-lg sm:text-xl font-semibold italic text-orange-light mb-4">
                {tagline}
              </p>
            )}

            <p className="text-base sm:text-lg text-body-muted max-w-2xl mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
              <Link href={primaryCtaHref} className="btn-primary !py-3.5 !px-7">
                {primaryCtaText}
                <ArrowUpRight size={18} />
              </Link>
              <a href={phoneHref(BUSINESS.phone)} className="btn-outline !py-3.5 !px-7">
                <Phone size={18} />
                Call {BUSINESS.phoneDisplay}
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-body-muted text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-orange" /> Certified Clean Energy Council Standard
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-orange" /> Master Electricians Member
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-orange" /> 100% ACT &amp; NSW Compliant
              </span>
            </div>
          </div>

          {imageSrc && (
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/15 aspect-[4/3] group">
                <img
                  src={imageSrc}
                  alt={imageAlt || title}
                  width={1000}
                  height={750}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 card-glass !bg-navy-950/75 p-3.5 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold truncate pr-2">{title}</span>
                  <span className="text-orange-light font-extrabold shrink-0">ACT #{BUSINESS.licence}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
