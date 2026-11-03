import { PhoneCall, ClipboardCheck, Wrench, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Reveal from "@/components/ui/reveal";

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
  eyebrow?: string;
}

/** Dark process timeline: numbered circles joined by a glowing curved line. */
export default function ProcessSteps({
  title = "Our Streamlined 4-Step Process",
  subtitle = "From first phone call to final sign-off, experience a seamless, hassle-free electrical service.",
  steps = DEFAULT_STEPS,
  eyebrow = "How It Works",
}: ProcessStepsProps) {
  return (
    <section className="section-dark section-padding border-t border-white/5 overflow-hidden">
      <div className="container-custom">
        <SectionHeading eyebrow={eyebrow} line1={title} intro={subtitle} />

        <div className="relative">
          {/* Curved glowing line behind the circles (desktop) */}
          <svg
            aria-hidden="true"
            className="hidden lg:block absolute left-0 right-0 top-0 w-full h-24 pointer-events-none"
            viewBox="0 0 1000 96"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M60 48 C 200 -6, 300 102, 440 48 S 700 -6, 940 48"
              strokeWidth="1.5"
              className="wire-orange"
              opacity="0.7"
            />
            <path
              d="M60 48 C 200 102, 300 -6, 440 48 S 700 102, 940 48"
              strokeWidth="1"
              className="wire-orange"
              opacity="0.35"
            />
          </svg>

          {/* Mobile vertical line */}
          <div className="lg:hidden absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-orange/60 via-orange/30 to-transparent" />

          <ol className="relative grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step, idx) => (
              <li key={idx}>
                <Reveal delay={idx * 90} className="flex lg:flex-col lg:items-center lg:text-center gap-5">
                  <span className="relative z-10 w-12 h-12 lg:w-24 lg:h-24 shrink-0 rounded-full border border-orange/60 bg-navy-950 text-orange-light font-extrabold text-base lg:text-2xl flex items-center justify-center shadow-[0_0_28px_rgba(232,117,26,0.28)]">
                    {step.number}
                  </span>
                  <div className="lg:pt-2">
                    <h3 className="text-lg text-white mb-2">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-body-muted">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
