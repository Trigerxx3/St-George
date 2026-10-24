import Link from "next/link";
import {
  Sun,
  BatteryFull,
  ArrowRight,
  Check,
  Leaf,
  DollarSign,
  Home,
  ShieldCheck,
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
                { icon: Sun, label: "Premium Tier-1 solar panels" },
                { icon: BatteryFull, label: "Home battery backup systems" },
                { icon: DollarSign, label: "Cut power bills up to 70%+" },
                { icon: Leaf, label: "Clean, renewable energy" },
                { icon: Home, label: "Residential & commercial" },
                { icon: Check, label: "Clean Energy Council accredited" },
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
              <Link href="/quote?service=solar-battery" className="btn-secondary">
                Get a Free Quote
              </Link>
            </div>
          </div>

          {/* Right: Real Battery & Inverter Installation Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-navy/5 shadow-2xl border border-gray-200 group">
              <img
                src="/images/services/battery-storage.jpg"
                alt="Tesla home battery storage and hybrid solar inverter installation in residential garage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-4 lg:-left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center shrink-0">
                  <DollarSign size={20} className="text-green" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Average Savings</p>
                  <p className="text-xl font-bold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
                    Up to 70% – 85%
                  </p>
                  <p className="text-[11px] text-green font-medium">ACT Scheme 0% Finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
