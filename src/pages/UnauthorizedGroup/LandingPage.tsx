import { CTASection } from "../../components/landingPage/ctaSection";
import { FeaturesSection } from "../../components/landingPage/featuresSection";
import { FooterSection } from "../../components/landingPage/footerSection";
import { HeroSection } from "../../components/landingPage/heroSection";
import { Navbar } from "../../components/landingPage/navbar";
import { ServicesSection } from "../../components/landingPage/servicesSection";
import { TestimonialsSection } from "../../components/landingPage/testemonialsSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}

export default LandingPage;
