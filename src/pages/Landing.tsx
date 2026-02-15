import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeTapes from "@/components/MarqueeTapes";
import SocialProof from "@/components/SocialProof";
import MechanicsSection from "@/components/MechanicsSection";
import ComparisonSection from "@/components/ComparisonSection";
import ReceiptComparison from "@/components/ReceiptComparison";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Landing = () => {
  return (
    <>
      <div className="noise-overlay" />
      <Header />
      <main>
        <HeroSection />
        <MarqueeTapes />
        <SocialProof />
        <MechanicsSection />
        <ReceiptComparison />
        <ComparisonSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default Landing;
