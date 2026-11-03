import HeroSection from "@/components/home/hero-section";
import ServiceCards from "@/components/home/service-cards";
import ProcessSteps from "@/components/services/process-steps";
import ServiceCTA from "@/components/services/service-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <div id="how-it-works">
        <ProcessSteps eyebrow="02 — Simple Process" />
      </div>
      <ServiceCTA />
    </>
  );
}
