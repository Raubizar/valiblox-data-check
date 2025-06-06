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
            </h1>            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Drag a folder, get a compliance PDF. 1,000 checks cost just €9
            </p>            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex flex-col">
                <Link to="/naming-demo">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg w-full sm:w-auto">
                    Open Naming Demo →
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-1 text-center lg:text-left">No sign-up needed</p>
              </div>
              <div className="flex flex-col">
                <Link to="/drawinglist-demo">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full sm:w-auto">
                    Open Deliverables Demo →
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-1 text-center lg:text-left">No sign-up needed</p>
              </div>
            </div>
          </div>
            <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
              <video 
                autoPlay 
                loop 
                muted 
                className="w-full h-auto rounded-lg"
                poster="/placeholder.svg"
              >
                <source src="/HeroGif.mp4" type="video/mp4" />
                <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">Video not available</p>
                </div>
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
