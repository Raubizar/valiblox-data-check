
import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { ProjectsOverview } from "@/components/Dashboard/ProjectsOverview";
import { SavedNamingStandards } from "@/components/Dashboard/SavedNamingStandards";
import { ReportsSection } from "@/components/Dashboard/ReportsSection";
import { HistoryInsights } from "@/components/Dashboard/HistoryInsights";
import { AccountSettings } from "@/components/Dashboard/AccountSettings";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's an overview of your validation activities.</p>
            </div>
            <ProjectsOverview />
            <HistoryInsights />
          </div>
        );
      case "projects":
        return <ProjectsOverview />;
      case "standards":
        return <SavedNamingStandards />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <AccountSettings />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's an overview of your validation activities.</p>
            </div>
            <ProjectsOverview />
            <HistoryInsights />
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
    </div>
  );
}
