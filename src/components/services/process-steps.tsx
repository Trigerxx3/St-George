import { PhoneCall, ClipboardCheck, Wrench, Zap } from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: any;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Enquire & Free Consultation",
    description: "Submit our quick online form or give Justin a call. We'll understand your goals, energy usage, and site details.",
    icon: PhoneCall,
  },
  {
    number: "02",
    title: "Site Assessment & Proposal",
    description: "We review your electrical layout, switchboard capacity, and solar/EV potential, providing an honest, transparent quotation.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Licensed Installation",
    description: "Our certified technicians carry out clean, compliant work adhering strictly to Australian standards (AS/NZS 3000, AS/NZS 5033).",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Testing & Handover",
    description: "We commission your system, test every circuit, set up your smart monitoring app, and issue all ACT compliance certificates.",
    icon: Zap,
  },
];

interface ProcessStepsProps {
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

export default function ProcessSteps({
  title = "Our Streamlined 4-Step Process",
  subtitle = "From first phone call to final sign-off, experience a seamless, hassle-free electrical service.",
  steps = DEFAULT_STEPS,
}: ProcessStepsProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-primary mb-3">How It Works</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-off-white p-6 rounded-xl border border-gray-100 hover:border-green/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-3xl font-extrabold text-navy/20"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-green/10 text-green flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-navy mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
