// Feature flags for Wave-1 launch
// Following Rob Walling's "Start Small Stay Small" approach

export interface FeatureFlags {
  // Dashboard features
  dashboardValidationTab: boolean;
  dashboardStandardsTab: boolean;
  dashboardReportsTab: boolean;
  dashboardAutomationTab: boolean;
  dashboardInsightsTab: boolean;
  
  // Navigation features
  tutorialsPage: boolean;
  articlesPage: boolean;
  aboutPage: boolean;
  pricingPage: boolean;
  comingSoonTools: boolean;
}

// Wave-1 configuration: Only Projects tab functional, others "Coming Soon"
export const featureFlags: FeatureFlags = {
  // Dashboard: Only Projects active for Wave-1
  dashboardValidationTab: false,
  dashboardStandardsTab: false,
  dashboardReportsTab: false,
  dashboardAutomationTab: false,
  dashboardInsightsTab: false,
  
  // Navigation: Pruned for Wave-1 focus
  tutorialsPage: false,
  articlesPage: false,
  aboutPage: false,
  pricingPage: false,
  comingSoonTools: false,
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature];
};

// Wave-1 focus: €9 per 1,000 file checks
// Only show: Home, Naming Demo, Drawing Demo, Dashboard
// Dashboard: Only Projects tab functional
