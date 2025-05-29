
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText } from "lucide-react";

export const ReportsSection = () => {
  const reports = [
    {
      id: 1,
      name: "Weekly Validation Report #23",
      project: "Office Building A - Phase 1",
      dateCreated: "2024-05-28",
      complianceRate: 95,
      filesChecked: 45,
      status: "completed",
    },
    {
      id: 2,
      name: "Monthly Compliance Summary",
      project: "Residential Complex B",
      dateCreated: "2024-05-27",
      complianceRate: 88,
      filesChecked: 132,
      status: "completed",
    },
    {
      id: 3,
      name: "Final Project Validation",
      project: "Infrastructure Project C",
      dateCreated: "2024-05-20",
      complianceRate: 92,
      filesChecked: 89,
      status: "completed",
    },
    {
      id: 4,
      name: "Quality Check Report #15",
      project: "Shopping Mall Development",
      dateCreated: "2024-05-26",
      complianceRate: 97,
      filesChecked: 67,
      status: "processing",
    },
  ];

  const getComplianceBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-100 text-green-800">{rate}% Excellent</Badge>;
    if (rate >= 85) return <Badge className="bg-yellow-100 text-yellow-800">{rate}% Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">{rate}% Needs Review</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Validation Reports</h2>
          <p className="text-gray-600 mt-1">Download and review your compliance reports</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Files Checked</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="text-gray-600">{report.project}</TableCell>
                  <TableCell className="text-gray-600">{report.dateCreated}</TableCell>
                  <TableCell>{report.filesChecked} files</TableCell>
                  <TableCell>{getComplianceBadge(report.complianceRate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
