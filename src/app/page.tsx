import HeroSection from "@/components/home/hero-section";
import ValuePillars from "@/components/home/value-pillars";
import SolarFeatureBlock from "@/components/home/solar-feature-block";
import ServiceCards from "@/components/home/service-cards";
import SectorBanner from "@/components/home/sector-banner";
import CalculatorTeaser from "@/components/home/calculator-teaser";
import FeaturedProducts from "@/components/home/featured-products";
import CaseStudyPreview from "@/components/home/case-study-preview";
import TestimonialSlider from "@/components/home/testimonial-slider";
import LicenceTrustBar from "@/components/home/licence-trust-bar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuePillars />
      <SolarFeatureBlock />
      <ServiceCards />
      <SectorBanner />
      <CalculatorTeaser />
      <FeaturedProducts />
      <CaseStudyPreview />
      <TestimonialSlider />
      <LicenceTrustBar />
    </>
  );
}
