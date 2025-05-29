
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Valiblox!",
      description: "Let's get you started with a quick tour of the platform",
      icon: CheckCircle,
      content: (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-4">Ready to transform your workflow?</h3>
          <p className="text-gray-600 mb-6">
            This quick tour will show you how to upload your first project and run a validation
          </p>
        </div>
      ),
    },
    {
      title: "Upload Your Project",
      description: "Start by uploading your project files",
      icon: Upload,
      content: (
        <div className="py-8">
          <h3 className="text-lg font-semibold mb-4">Upload Sample Files</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your files here</p>
            <p className="text-sm text-gray-500">Supports CAD files, documents, and more</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700">
              Choose Files
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Configure Standards",
      description: "Set up your naming conventions",
      icon: Settings,
      content: (
        <div className="py-8">
          <h3 className="text-lg font-semibold mb-4">Choose a Naming Standard</h3>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="font-medium">CAD Drawing Standard v2.1</div>
              <div className="text-sm text-gray-600">Standard for CAD files and technical drawings</div>
            </div>
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="font-medium">Document Control Standard</div>
              <div className="text-sm text-gray-600">For project documents and specifications</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Run Your First Validation",
      description: "See instant results and compliance scores",
      icon: CheckCircle,
      content: (
        <div className="py-8">
          <h3 className="text-lg font-semibold mb-4">Validation Complete!</h3>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">95% Compliant</div>
            <p className="text-gray-600 mb-4">
              Great job! Your files are mostly compliant with the naming standards.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Compliant files:</span>
                <span className="font-medium">19/20</span>
              </div>
              <div className="flex justify-between">
                <span>Issues found:</span>
                <span className="font-medium">1 minor</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">{currentStepData.title}</DialogTitle>
              <p className="text-sm text-gray-600">{currentStepData.description}</p>
            </div>
          </div>
          <Progress value={(currentStep + 1) / steps.length * 100} className="w-full" />
        </DialogHeader>
        
        <div className="min-h-[300px]">
          {currentStepData.content}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          
          <Button
            onClick={nextStep}
            className="bg-green-600 hover:bg-green-700"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
