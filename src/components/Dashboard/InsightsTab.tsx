
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export const InsightsTab = () => {
  const complianceData = [
    { month: "Jan", "Office Building A": 88, "Residential Complex B": 92, "Infrastructure Project C": 85 },
    { month: "Feb", "Office Building A": 91, "Residential Complex B": 89, "Infrastructure Project C": 88 },
    { month: "Mar", "Office Building A": 94, "Residential Complex B": 93, "Infrastructure Project C": 90 },
    { month: "Apr", "Office Building A": 96, "Residential Complex B": 95, "Infrastructure Project C": 92 },
    { month: "May", "Office Building A": 95, "Residential Complex B": 97, "Infrastructure Project C": 94 },
  ];

  const reportsData = [
    { month: "Jan", reports: 12 },
    { month: "Feb", reports: 18 },
    { month: "Mar", reports: 15 },
    { month: "Apr", reports: 22 },
    { month: "May", reports: 19 },
  ];

  const chartConfig = {
    "Office Building A": {
      label: "Office Building A",
      color: "#10b981",
    },
    "Residential Complex B": {
      label: "Residential Complex B",
      color: "#3b82f6",
    },
    "Infrastructure Project C": {
      label: "Infrastructure Project C",
      color: "#f59e0b",
    },
    reports: {
      label: "Reports",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Insights & Analytics</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-green-600 mt-1">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Files Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-green-600 mt-1">+156 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">94.2%</div>
            <p className="text-xs text-green-600 mt-1">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">47h</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="Office Building A" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Residential Complex B" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Infrastructure Project C" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports Generated per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="reports" fill="#8b5cf6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
