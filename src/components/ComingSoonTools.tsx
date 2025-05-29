
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Zap, Shield, FileSearch, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ComingSoonTools = () => {
  const { toast } = useToast();
  const [suggestion, setSuggestion] = useState({
    title: "",
    description: "",
    email: "",
  });

  const upcomingTools = [
    {
      title: "AI Document Analysis",
      description: "Automatically analyze document content for compliance and quality",
      icon: FileSearch,
      eta: "Q3 2024",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together on validations with live commenting and suggestions",
      icon: MessageSquare,
      eta: "Q4 2024",
    },
    {
      title: "Advanced Security Scanner",
      description: "Scan files for security vulnerabilities and sensitive data",
      icon: Shield,
      eta: "Q1 2025",
    },
    {
      title: "Smart Workflow Automation",
      description: "Automate repetitive validation tasks with AI-powered workflows",
      icon: Zap,
      eta: "Q2 2025",
    },
  ];

  const handleSubmitSuggestion = () => {
    if (suggestion.title && suggestion.description) {
      // Here you would typically send the suggestion to your backend
      toast({
        title: "Suggestion submitted!",
        description: "Thank you for your feedback. We'll review your suggestion soon.",
      });
      setSuggestion({ title: "", description: "", email: "" });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're constantly building new tools to make your engineering workflow even better
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {upcomingTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    ETA: {tool.eta}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Lightbulb className="w-5 h-5 mr-3" />
                Suggest a Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Suggest a New Tool</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="toolTitle">Tool Name</Label>
                  <Input
                    id="toolTitle"
                    value={suggestion.title}
                    onChange={(e) => setSuggestion({...suggestion, title: e.target.value})}
                    placeholder="What should we call this tool?"
                  />
                </div>
                <div>
                  <Label htmlFor="toolDescription">Description</Label>
                  <Textarea
                    id="toolDescription"
                    value={suggestion.description}
                    onChange={(e) => setSuggestion({...suggestion, description: e.target.value})}
                    placeholder="Describe what this tool should do and how it would help your workflow..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={suggestion.email}
                    onChange={(e) => setSuggestion({...suggestion, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll contact you when this tool is ready
                  </p>
                </div>
                <Button 
                  onClick={handleSubmitSuggestion} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Submit Suggestion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
