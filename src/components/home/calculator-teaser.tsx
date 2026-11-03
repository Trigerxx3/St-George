import Link from "next/link";
import { ArrowUpRight, Sun, DollarSign, Leaf } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

export default function CalculatorTeaser() {
  return (
    <section className="section-dark section-padding border-0">
      <div className="container-custom">
        <SectionHeading
          eyebrow="03 — Free Online Tool"
          line1="How Much Could You"
          line2="Save with Solar?"
          intro="Use our free solar savings calculator to estimate your system size, annual savings, and payback period based on your electricity bill."
        />

        <div className="card-glass p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange/10 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p
                className="text-xs text-[#9fb2c8] mb-5 uppercase tracking-[0.18em] font-bold"
              >
                Example Estimate
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Sun, label: "System Size", value: "6.6 kW", note: "[example]" },
                  { icon: DollarSign, label: "Annual Savings", value: "$1,800+", note: "[placeholder]" },
                  { icon: Leaf, label: "CO₂ Offset", value: "8.5 tonnes/yr", note: "[estimate]" },
                ].map(({ icon: Icon, label, value, note }) => (
                  <div key={label} className="rounded-xl border-0 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <Icon size={22} strokeWidth={1.4} className="text-orange-light" />
                      <span className="text-[10px] text-[#9fb2c8]">{note}</span>
                    </div>
                    <p className="text-xs text-[#9fb2c8] mb-1">{label}</p>
                    <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/calculator" className="btn-primary !py-4 !px-7 justify-self-start lg:justify-self-end">
              Calculate Your Savings
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
