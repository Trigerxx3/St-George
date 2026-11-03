import Link from "next/link";
import { Shield, Award, CheckCircle, FileCheck, ArrowUpRight } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const ITEMS = [
  { icon: Shield, title: "ACT Licensed", desc: `Licence #${BUSINESS.licence}` },
  { icon: CheckCircle, title: "Fully Insured", desc: "Public liability coverage" },
  { icon: Award, title: "Master Electricians", desc: "Proud member" },
  { icon: FileCheck, title: "AS/NZS Compliant", desc: "Australian Standards" },
];

/** CTA band: photo background, navy overlay, heading + button left, glass trust card right. */
export default function LicenceTrustBar() {
  return (
    <section className="section-dark relative overflow-hidden section-padding">
      <img
        src="/images/services/commercial-solar.jpg"
        alt=""
        aria-hidden="true"
        width={1600}
        height={900}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-navy-950/85" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/70 to-navy-950/40" />

      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="eyebrow mb-4">08 — Trusted Workmanship</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8">
            ACT Licensed. Fully Insured.
            <br />
            <span className="text-accent">Master Electricians.</span>
          </h2>
          <Link href="/quote" className="btn-primary !py-3.5 !px-7">
            Request a Free Quote
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="card-glass !bg-navy-950/60 p-6 sm:p-8 divide-y divide-white/10">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className="w-12 h-12 rounded-xl border border-orange/40 text-orange-light flex items-center justify-center shrink-0">
                <Icon size={22} strokeWidth={1.4} />
              </span>
              <div>
                <p className="text-white font-extrabold text-sm uppercase tracking-[0.1em]">{title}</p>
                <p className="text-sm text-[#9fb2c8]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
