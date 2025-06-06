import { useState } from "react";
import { FolderOpen, Zap, FileCheck } from "lucide-react";

export const ProgressSteps = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      icon: FolderOpen,
      title: "Upload",
      description: "Drag & drop your files",
      emoji: "📂"
    },
    {
      id: 2,
      icon: Zap,
      title: "Lightning",
      description: "AI processes in <15 sec",
      emoji: "⚡"
    },
    {
      id: 3,
      icon: FileCheck,
      title: "PDF",
      description: "Download branded report",
      emoji: "✅"
    }
  ];

  const getStepColor = (stepId: number) => {
    if (hoveredStep === null) {
      // Default state: first step green, others red
      return stepId === 1 ? "text-green-600 border-green-600" : "text-red-500 border-red-500";
    }
    
    // Hover state: hovered step and all previous steps are green
    return stepId <= hoveredStep ? "text-green-600 border-green-600" : "text-red-500 border-red-500";
  };

  const getConnectorColor = (stepId: number) => {
    if (hoveredStep === null) {
      // Default state: only first connector is green
      return stepId === 1 ? "bg-green-600" : "bg-red-500";
    }
    
    // Hover state: connectors up to hovered step are green
    return stepId < hoveredStep ? "bg-green-600" : "bg-red-500";
  };

  const getBackgroundColor = (stepId: number) => {
    if (hoveredStep === null) {
      return stepId === 1 ? "bg-green-50" : "bg-red-50";
    }
    
    return stepId <= hoveredStep ? "bg-green-50" : "bg-red-50";
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            From Upload to Proof in 3 Steps
          </h2>
          
          <div className="relative flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="relative flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                      relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 transform
                      ${hoveredStep === step.id ? 'scale-110' : 'hover:scale-105'}
                    `}
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {/* Icon Circle */}
                    <div className={`
                      w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300
                      ${getStepColor(step.id)} ${getBackgroundColor(step.id)}
                    `}>
                      <Icon size={32} />
                    </div>
                    
                    {/* Step Info */}
                    <div className="mt-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl">{step.emoji}</span>
                        <h3 className={`font-bold text-lg transition-colors duration-300 ${
                          hoveredStep === null 
                            ? (step.id === 1 ? "text-green-600" : "text-red-500")
                            : (step.id <= (hoveredStep || 0) ? "text-green-600" : "text-red-500")
                        }`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 max-w-[120px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <div className={`
                      h-1 w-24 mx-8 transition-all duration-300 rounded-full
                      ${getConnectorColor(step.id)}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Bottom Text */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Simply drag your files, watch our AI work its magic, and get a professional compliance report. 
              <span className="font-semibold text-green-600"> 1,000 checks for just €9.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
