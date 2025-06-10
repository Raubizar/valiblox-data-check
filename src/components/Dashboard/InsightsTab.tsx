
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import { ProjectService } from "@/lib/projectService";
import type { DashboardInsights, DisciplinePerformance } from "@/types/database";
import { SpeedometerChart } from "@/components/SpeedometerChart";

export const InsightsTab = () => {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [disciplines, setDisciplines] = useState<DisciplinePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [dashboardData, disciplineData] = await Promise.all([
        ProjectService.getDashboardInsights(),
        ProjectService.getDisciplinePerformance()
      ]);
      setInsights(dashboardData);
      setDisciplines(disciplineData);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast({
        title: "Error",
        description: "Failed to load insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    match_rate: {
      label: "Match Rate",
      color: "#10b981",
    },
    compliance_rate: {
      label: "Compliance Rate",
      color: "#3b82f6",
    },
    reports: {
      label: "Reports",
      color: "#8b5cf6",
    },
  };

  const disciplineColors = [
    '#EF4444', '#3B82F6', '#10B981', '#F59E0B', 
    '#8B5CF6', '#DC2626', '#059669', '#6B7280'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Insights & Analytics</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{insights?.total_projects || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{insights?.total_reports || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Generated reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {insights?.avg_match_rate ? `${Math.round(insights.avg_match_rate)}%` : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Deliverables validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {insights?.avg_compliance_rate ? `${Math.round(insights.avg_compliance_rate)}%` : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Naming convention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Discipline Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplines.map((discipline, index) => (
                <div key={discipline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: discipline.color || disciplineColors[index % disciplineColors.length] }}
                    />
                    <div>
                      <div className="font-medium">{discipline.name}</div>
                      <div className="text-sm text-gray-500">{discipline.total_reports} reports</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {discipline.avg_match_rate !== null && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Match</div>
                        <SpeedometerChart 
                          percentage={Math.round(discipline.avg_match_rate || 0)} 
                          label=""
                          size={40}
                        />
                      </div>
                    )}
                    {discipline.avg_compliance_rate !== null && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Compliance</div>
                        <SpeedometerChart 
                          percentage={Math.round(discipline.avg_compliance_rate || 0)} 
                          label=""
                          size={40}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports by Discipline</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disciplines}
                    dataKey="total_reports"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {disciplines.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color || disciplineColors[index % disciplineColors.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {insights?.recent_reports && insights.recent_reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recent_reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-gray-500">
                      {report.report_type === 'deliverables' ? 'Deliverables' : 'Naming'} • {report.file_count} files
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {report.report_type === 'deliverables' && report.match_rate !== null
                        ? `${Math.round(report.match_rate)}% match`
                        : report.report_type === 'naming' && report.compliance_rate !== null
                        ? `${Math.round(report.compliance_rate)}% compliance`
                        : 'N/A'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
