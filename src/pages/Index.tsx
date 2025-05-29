
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ToolsOverview } from "@/components/ToolsOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSection } from "@/components/TrustSection";
import { Impact } from "@/components/Impact";
import { ComingSoon } from "@/components/ComingSoon";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <ToolsOverview />
        <HowItWorks />
        <TrustSection />
        <Impact />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
