
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Upload, Settings, Download } from "lucide-react";

export const HowItWorks = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Upload Your Files",
      description: "Drag and drop your project files or connect your file system",
      icon: Upload,
      details: "Supports all major file formats including CAD files, documents, and custom formats. Batch upload thousands of files at once."
    },
    {
      number: "02", 
      title: "Configure Standards",
      description: "Set up your naming conventions and validation rules",
      icon: Settings,
      details: "Create custom naming standards, define validation rules, and set up automated checks for your specific project requirements."
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive instant validation reports and compliance insights",
      icon: Download,
      details: "Download detailed reports, view compliance scores, and get actionable insights to improve your project quality."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="text-2xl font-bold text-gray-900 hover:bg-transparent p-0">
                <span>How Valiblox Works</span>
                <ChevronDown className={`w-6 h-6 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-8">
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Get started in three simple steps and transform your project workflow
              </p>
              
              <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-8 text-center">
                        <div className="absolute top-4 left-4 text-5xl font-bold text-green-100">
                          {step.number}
                        </div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                          <Icon className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {step.details}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
};
