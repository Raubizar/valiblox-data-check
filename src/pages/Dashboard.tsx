
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
import { ComingSoonTab } from "@/components/ComingSoonTab";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckSquare, FileText, BarChart3, Cog, TrendingUp } from "lucide-react";
import { isFeatureEnabled } from "@/config/featureFlags";

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
                <TabsTrigger 
                  value="validation" 
                  disabled={!isFeatureEnabled('dashboardValidationTab')}
                  className={!isFeatureEnabled('dashboardValidationTab') ? 'opacity-50' : ''}
                >
                  Validation
                </TabsTrigger>
                <TabsTrigger 
                  value="standards" 
                  disabled={!isFeatureEnabled('dashboardStandardsTab')}
                  className={!isFeatureEnabled('dashboardStandardsTab') ? 'opacity-50' : ''}
                >
                  Standards
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  disabled={!isFeatureEnabled('dashboardReportsTab')}
                  className={!isFeatureEnabled('dashboardReportsTab') ? 'opacity-50' : ''}
                >
                  Reports
                </TabsTrigger>
                <TabsTrigger 
                  value="automation" 
                  disabled={!isFeatureEnabled('dashboardAutomationTab')}
                  className={!isFeatureEnabled('dashboardAutomationTab') ? 'opacity-50' : ''}
                >
                  Automation
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  disabled={!isFeatureEnabled('dashboardInsightsTab')}
                  className={!isFeatureEnabled('dashboardInsightsTab') ? 'opacity-50' : ''}
                >
                  Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="mt-6">
                <ProjectsTab />
              </TabsContent>
              
              <TabsContent value="validation" className="mt-6">
                {isFeatureEnabled('dashboardValidationTab') ? (
                  <DisciplineValidation />
                ) : (
                  <ComingSoonTab
                    title="Validation Tools"
                    description="Advanced validation workflows for multiple engineering disciplines"
                    icon={<CheckSquare className="w-12 h-12 text-blue-500" />}
                    features={[
                      "Multi-discipline validation workflows",
                      "Custom validation rules engine",
                      "Automated quality checks",
                      "Integration with CAD systems",
                      "Real-time validation feedback"
                    ]}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="standards" className="mt-6">
                {isFeatureEnabled('dashboardStandardsTab') ? (
                  <SavedNamingStandards />
                ) : (
                  <ComingSoonTab
                    title="Standards Management"
                    description="Centralized management of naming conventions and standards"
                    icon={<FileText className="w-12 h-12 text-blue-500" />}
                    features={[
                      "Custom naming convention templates",
                      "Standards library management",
                      "Version control for standards",
                      "Team collaboration on standards",
                      "Standards compliance reporting"
                    ]}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                {isFeatureEnabled('dashboardReportsTab') ? (
                  <ReportsTab />
                ) : (
                  <ComingSoonTab
                    title="Advanced Reports"
                    description="Comprehensive reporting and analytics for your validation data"
                    icon={<BarChart3 className="w-12 h-12 text-blue-500" />}
                    features={[
                      "Custom report templates",
                      "Automated report generation",
                      "Data export capabilities",
                      "Trend analysis and insights",
                      "Branded report downloads"
                    ]}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="automation" className="mt-6">
                {isFeatureEnabled('dashboardAutomationTab') ? (
                  <AutomatedReporting />
                ) : (
                  <ComingSoonTab
                    title="Automation Suite"
                    description="Automated workflows and scheduled reporting"
                    icon={<Cog className="w-12 h-12 text-blue-500" />}
                    features={[
                      "Scheduled validation runs",
                      "Automated report delivery",
                      "Workflow automation",
                      "API integrations",
                      "Custom automation scripts"
                    ]}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="insights" className="mt-6">
                {isFeatureEnabled('dashboardInsightsTab') ? (
                  <InsightsTab />
                ) : (
                  <ComingSoonTab
                    title="Business Insights"
                    description="Advanced analytics and business intelligence for your projects"
                    icon={<TrendingUp className="w-12 h-12 text-blue-500" />}
                    features={[
                      "Project performance analytics",
                      "Team productivity metrics",
                      "Compliance trend analysis",
                      "Predictive insights",
                      "Executive dashboards"
                    ]}
                  />
                )}
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
