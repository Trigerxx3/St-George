import Link from "next/link";
import {
  Sun,
  BatteryFull,
  ArrowRight,
  Check,
  Leaf,
  DollarSign,
  Home,
} from "lucide-react";

export default function SolarFeatureBlock() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green text-sm font-semibold rounded-full mb-4">
              <Sun size={16} />
              Solar &amp; Battery Solutions
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Smart. Sustainable.
              <br />
              <span className="text-green">Reliable.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-lg">
              Take control of your energy with premium solar panel and battery storage 
              solutions designed for Australian conditions. Cut your electricity bills 
              and power your home with clean energy.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Sun, label: "Premium solar panels" },
                { icon: BatteryFull, label: "Home battery storage" },
                { icon: DollarSign, label: "Reduce energy bills" },
                { icon: Leaf, label: "Clean, renewable energy" },
                { icon: Home, label: "Residential & commercial" },
                { icon: Check, label: "CEC accredited installs" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-green" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/solar-battery" className="btn-primary">
                Learn More
                <ArrowRight size={18} />
              </Link>
              <Link href="/quote" className="btn-secondary">
                Get a Free Quote
              </Link>
            </div>
          </div>

          {/* Right: Image placeholder */}
          <div className="relative">
            <div className="placeholder-image rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Sun size={64} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">
                  Solar Installation Photo
                </p>
                <p className="text-xs mt-1">
                  [PLACEHOLDER — replace with real project photo]
                </p>
              </div>
            </div>
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-green" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Average Savings</p>
                  <p className="text-lg font-bold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
                    Up to 70%
                  </p>
                  <p className="text-[10px] text-gray-400">[PLACEHOLDER — verify savings claim]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
