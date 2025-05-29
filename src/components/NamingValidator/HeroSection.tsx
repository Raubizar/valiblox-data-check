
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  validationComplete: boolean;
}

export const HeroSection = ({ validationComplete }: HeroSectionProps) => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Naming Standard <span className="text-green-600">Validator</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
        Ensure every file follows your project's Document Naming Standard — fast, consistent, and error-free.
      </p>
      {!validationComplete && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
            View Demo
          </Button>
        </div>
      )}
    </div>
  );
};
