
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Bell, Clock, Send } from "lucide-react";

interface ReportConfig {
  id: number;
  projectName: string;
  disciplineName: string;
  pmEmail: string;
  teamEmails: string[];
  dueDate: string;
  autoReports: boolean;
  reminderDays: number[];
  lastReminder: string | null;
  status: 'scheduled' | 'sent' | 'overdue';
}

export const AutomatedReporting = () => {
  const [reportConfigs, setReportConfigs] = useState<ReportConfig[]>([
    {
      id: 1,
      projectName: "Office Building A - Phase 1",
      disciplineName: "Architecture",
      pmEmail: "pm@contractor.com",
      teamEmails: ["arch@contractor.com", "lead.arch@contractor.com"],
      dueDate: "2024-06-15",
      autoReports: true,
      reminderDays: [3, 2, 1],
      lastReminder: "2024-06-12",
      status: 'scheduled'
    },
    {
      id: 2,
      projectName: "Office Building A - Phase 1",
      disciplineName: "MEP",
      pmEmail: "pm@contractor.com",
      teamEmails: ["mep@contractor.com"],
      dueDate: "2024-06-05",
      autoReports: true,
      reminderDays: [3, 2, 1],
      lastReminder: "2024-06-04",
      status: 'overdue'
    },
    {
      id: 3,
      projectName: "Residential Complex B",
      disciplineName: "Structure",
      pmEmail: "pm2@contractor.com",
      teamEmails: ["struct@contractor.com"],
      dueDate: "2024-06-20",
      autoReports: false,
      reminderDays: [3, 1],
      lastReminder: null,
      status: 'scheduled'
    }
  ]);

  const [sentReports, setSentReports] = useState([
    {
      id: 1,
      projectName: "Office Building A - Phase 1",
      disciplineName: "Architecture",
      reportType: "Discipline-specific",
      sentTo: "arch@contractor.com",
      sentAt: "2024-05-28 14:30",
      passRate: 95,
      issues: 2
    },
    {
      id: 2,
      projectName: "Office Building A - Phase 1",
      disciplineName: "Summary",
      reportType: "Project Summary",
      sentTo: "pm@contractor.com",
      sentAt: "2024-05-28 14:35",
      passRate: 92,
      issues: 5
    }
  ]);

  const toggleAutoReports = (configId: number) => {
    setReportConfigs(configs =>
      configs.map(config =>
        config.id === configId
          ? { ...config, autoReports: !config.autoReports }
          : config
      )
    );
  };

  const sendManualReminder = (configId: number) => {
    console.log(`Sending manual reminder for config ${configId}`);
    // Update last reminder date
    setReportConfigs(configs =>
      configs.map(config =>
        config.id === configId
          ? { ...config, lastReminder: new Date().toISOString().split('T')[0] }
          : config
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'sent': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Automated Reporting & Reminders</h2>
        <p className="text-gray-600">Manage automatic report distribution and deadline reminders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Reminder Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project / Discipline</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Auto Reports</TableHead>
                <TableHead>Last Reminder</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportConfigs.map((config) => {
                const daysLeft = getDaysUntilDue(config.dueDate);
                return (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{config.projectName}</div>
                        <div className="text-sm text-gray-600">{config.disciplineName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{config.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          daysLeft < 0 ? 'bg-red-100 text-red-800' :
                          daysLeft <= 1 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                         daysLeft === 0 ? 'Due today' :
                         `${daysLeft} days left`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={config.autoReports}
                          onCheckedChange={() => toggleAutoReports(config.id)}
                        />
                        <Label className="text-sm">Auto</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      {config.lastReminder ? (
                        <span className="text-sm text-gray-600">{config.lastReminder}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(config.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => sendManualReminder(config.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Recent Report Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project / Discipline</TableHead>
                <TableHead>Report Type</TableHead>
                <TableHead>Sent To</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Pass Rate</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.projectName}</div>
                      <div className="text-sm text-gray-600">{report.disciplineName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.reportType === "Project Summary" ? "default" : "secondary"}>
                      {report.reportType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{report.sentTo}</TableCell>
                  <TableCell className="text-sm text-gray-600">{report.sentAt}</TableCell>
                  <TableCell>
                    <Badge className={report.passRate >= 95 ? 'bg-green-100 text-green-800' : 
                                    report.passRate >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}>
                      {report.passRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.issues > 0 ? (
                      <span className="text-red-600 font-medium">{report.issues}</span>
                    ) : (
                      <span className="text-green-600 font-medium">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Default Reminder Schedule</h4>
              <p className="text-sm text-blue-800">
                Teams receive automatic reminders at: <strong>3 days, 2 days, and 1 day</strong> before the due date
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Message: "Reminder: deliverables for [Discipline] due on [Date] – last validation result attached"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Discipline Reports</h4>
                <p className="text-sm text-gray-600">
                  Sent to assigned team emails after each validation run
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Summary Reports</h4>
                <p className="text-sm text-gray-600">
                  Sent to project manager with overall status across all disciplines
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
