import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { ProjectService } from "@/lib/projectService";
import { useAuth } from "@/hooks/useAuth";

export const ReportsTab = () => {
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      ProjectService.getReports(user.id)
        .then((data) => setReports(data))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  const getComplianceBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-100 text-green-800">{rate}% Excellent</Badge>;
    if (rate >= 85) return <Badge className="bg-yellow-100 text-yellow-800">{rate}% Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">{rate}% Needs Review</Badge>;
  };

  const handleRename = async (id: string) => {
    if (!user) return;
    await ProjectService.updateReport(id, { title: renameValue }, user.id);
    setRenamingId(null);
    setRenameValue("");
    // Refresh reports
    const data = await ProjectService.getReports(user.id);
    setReports(data);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await ProjectService.deleteReport(id, user.id);
    // Refresh reports
    const data = await ProjectService.getReports(user.id);
    setReports(data);
  };

  if (!isAuthenticated) {
    return <div className="p-8 text-center text-gray-600">Please sign in to view your reports.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
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
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Last Renamed</TableHead>
                  <TableHead>Files Checked</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">No reports found.</TableCell>
                  </TableRow>
                ) : (
                  reports.map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {renamingId === report.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              autoFocus
                            />
                            <Button size="sm" onClick={() => handleRename(report.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setRenamingId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {report.title}
                            <Button variant="ghost" size="sm" onClick={() => { setRenamingId(report.id); setRenameValue(report.title); }}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{report.projects?.name || "-"}</TableCell>
                      <TableCell className="text-gray-600">{new Date(report.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">{report.renamed_at ? new Date(report.renamed_at).toLocaleString() : "-"}</TableCell>
                      <TableCell>{report.file_count ?? "-"} files</TableCell>
                      <TableCell>{getComplianceBadge(report.compliance_rate ?? 0)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{report.title}</DialogTitle>
                              </DialogHeader>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(report.results, null, 2)}</pre>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Excel
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
