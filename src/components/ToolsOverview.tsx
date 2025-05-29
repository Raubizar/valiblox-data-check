
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, FileCheck, FolderOpen, BarChart3, Play } from "lucide-react";

export const ToolsOverview = () => {
  const [openTools, setOpenTools] = useState<string[]>([]);

  const tools = [
    {
      id: "naming-validator",
      title: "Naming Standard Validator",
      icon: FileCheck,
      shortDesc: "Validate file names against your naming conventions instantly",
      fullDesc: "Our AI-powered validator checks thousands of files in seconds, ensuring compliance with your specific naming standards. Supports CAD files, documents, and custom formats with detailed error reporting.",
      demoContent: "Interactive demo showing file validation process with sample CAD files and naming rules.",
    },
    {
      id: "deliverables-tracker",
      title: "Deliverables Tracker",
      icon: FolderOpen,
      shortDesc: "Track project deliverables and submission deadlines",
      fullDesc: "Comprehensive project management tool that monitors deliverable status, tracks submission deadlines, and provides real-time project health insights with automated notifications.",
      demoContent: "Demo dashboard showing project timeline, deliverable status, and notification system.",
    },
    {
      id: "compliance-reports",
      title: "Compliance Reports",
      icon: BarChart3,
      shortDesc: "Generate detailed compliance and quality reports",
      fullDesc: "Automated reporting system that generates comprehensive compliance reports, quality metrics, and project insights with customizable templates and export options.",
      demoContent: "Sample compliance report with charts, metrics, and export functionality.",
    },
  ];

  const toggleTool = (toolId: string) => {
    setOpenTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Tools for Project Success
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your engineering workflows with our comprehensive suite of validation and tracking tools
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isOpen = openTools.includes(tool.id);

            return (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  <p className="text-gray-600">{tool.shortDesc}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Collapsible open={isOpen} onOpenChange={() => toggleTool(tool.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                        <span className="text-green-600 font-medium">Learn more</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <p className="text-sm text-gray-600 mb-4">{tool.fullDesc}</p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Try Demo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-green-600" />
                          <span>{tool.title} Demo</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">{tool.demoContent}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
