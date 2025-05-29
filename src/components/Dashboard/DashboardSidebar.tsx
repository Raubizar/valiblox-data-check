
import { Home, FolderOpen, FileText, BarChart3, Settings, Users, Gift, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "referrals", label: "Refer & Earn", icon: Gift },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const handleSignOut = () => {
    // Placeholder for sign out functionality
    console.log("Sign out clicked");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center relative">
              <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center relative -ml-2">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">VALIBLOX</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => window.open("/tutorials", "_blank")}
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Tutorials
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 mt-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
