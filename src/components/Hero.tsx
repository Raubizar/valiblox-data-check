import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Turn days of document QA into a{" "}
              <span className="text-green-600">5-second, one-click task</span>
              —complete with branded, shareable proof.
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Validate naming and deliverables in seconds. Run 1,000 checks for just €9—no subscription.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/naming-demo">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg w-full sm:w-auto">
                  Try Naming Demo
                </Button>
              </Link>
              <Link to="/drawinglist-demo">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg w-full sm:w-auto">
                  Try Deliverables Demo
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium">Validation Report</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">File naming standards: ✓ Passed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Document completeness: ✓ Passed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Deliverables count: ⚠ 2 missing</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg mt-4">
                  <p className="text-sm text-green-700 font-medium">
                    Overall Score: 94% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
