
import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTab } from "@/components/Dashboard/ProjectsTab";
import { SavedNamingStandards } from "@/components/Dashboard/SavedNamingStandards";
import { ReportsTab } from "@/components/Dashboard/ReportsTab";
import { InsightsTab } from "@/components/Dashboard/InsightsTab";
import { OnboardingModal } from "@/components/Dashboard/OnboardingModal";
import { ReferralSection } from "@/components/Dashboard/ReferralSection";
import { TeamManagement } from "@/components/Dashboard/TeamManagement";
import { AccountSettings } from "@/components/Dashboard/AccountSettings";
import { FloatingHelpButton } from "@/components/FloatingHelpButton";
import { DisciplineValidation } from "@/components/Dashboard/DisciplineValidation";
import { AutomatedReporting } from "@/components/Dashboard/AutomatedReporting";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's an overview of your validation activities.</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowOnboarding(true)}
                className="flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Tour</span>
              </Button>
            </div>
            
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="standards">Standards</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="mt-6">
                <ProjectsTab />
              </TabsContent>
              
              <TabsContent value="validation" className="mt-6">
                <DisciplineValidation />
              </TabsContent>
              
              <TabsContent value="standards" className="mt-6">
                <SavedNamingStandards />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <ReportsTab />
              </TabsContent>
              
              <TabsContent value="automation" className="mt-6">
                <AutomatedReporting />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                <InsightsTab />
              </TabsContent>
            </Tabs>
          </div>
        );
      case "referrals":
        return <ReferralSection />;
      case "team":
        return <TeamManagement />;
      case "settings":
        return <AccountSettings />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's an overview of your validation activities.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
      
      <FloatingHelpButton />
      <OnboardingModal 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding} 
      />
    </div>
  );
}
