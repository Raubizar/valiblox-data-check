
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle, BookOpen, Play, MessageCircle } from "lucide-react";

export const FloatingHelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  const helpOptions = [
    {
      title: "Quick Tour",
      description: "Take a guided tour of the platform",
      icon: Play,
      action: () => {
        // This would trigger the onboarding modal
        console.log("Start tour");
      },
    },
    {
      title: "Tutorials",
      description: "Watch step-by-step video guides",
      icon: BookOpen,
      action: () => {
        window.open("/tutorials", "_blank");
      },
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      action: () => {
        // This would open a support chat or form
        console.log("Contact support");
      },
    },
  ];

  return (
    <>
      <Button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
        size="icon"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {helpOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
