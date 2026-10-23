import Link from "next/link";
import { Calculator, ArrowRight, Sun, DollarSign, Leaf } from "lucide-react";

export default function CalculatorTeaser() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green to-green-dark text-white p-8 sm:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm mb-6">
                <Calculator size={14} />
                Free Online Tool
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How Much Could You Save with Solar?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-md">
                Use our free solar savings calculator to estimate your system size, 
                annual savings, and payback period based on your electricity bill.
              </p>
              <Link href="/calculator" className="btn-outline text-lg !border-white/30">
                Calculate Your Savings
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Visual preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-sm">
                <p className="text-sm text-white/60 mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  Example Estimate
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Sun, label: "System Size", value: "6.6 kW", note: "[example]" },
                    { icon: DollarSign, label: "Annual Savings", value: "$1,800+", note: "[placeholder]" },
                    { icon: Leaf, label: "CO₂ Offset", value: "8.5 tonnes/yr", note: "[estimate]" },
                  ].map(({ icon: Icon, label, value, note }) => (
                    <div
                      key={label}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/50">{label}</p>
                        <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                          {value}
                        </p>
                      </div>
                      <span className="text-[10px] text-white/30">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
