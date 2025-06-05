
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PainPointSection } from "@/components/PainPointSection";
import { HowItWorksStrip } from "@/components/HowItWorksStrip";
import { ToolsTeaser } from "@/components/ToolsTeaser";
import { MinimalFooter } from "@/components/MinimalFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main>
        <Hero />
        <PainPointSection />
        <HowItWorksStrip />
        <ToolsTeaser />
      </main>
      <MinimalFooter />
    </div>
  );
};

export default Index;
