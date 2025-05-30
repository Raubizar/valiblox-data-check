
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Calendar, Mail, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface Discipline {
  id: number;
  name: string;
  color: string;
  fileScope: string;
  emailList: string[];
  dueDate: string;
  filesChecked: number;
  filesPassed: number;
  issues: number;
  status: 'on-track' | 'warning' | 'overdue';
}

interface DisciplineManagementProps {
  projectId: number;
  projectName: string;
}

export const DisciplineManagement = ({ projectId, projectName }: DisciplineManagementProps) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([
    {
      id: 1,
      name: "Architecture",
      color: "bg-blue-500",
      fileScope: "ARCH_*",
      emailList: ["arch@contractor.com"],
      dueDate: "2024-06-15",
      filesChecked: 45,
      filesPassed: 42,
      issues: 3,
      status: 'on-track'
    },
    {
      id: 2,
      name: "Structure",
      color: "bg-green-500",
      fileScope: "STRUCT_*",
      emailList: ["struct@contractor.com"],
      dueDate: "2024-06-10",
      filesChecked: 32,
      filesPassed: 28,
      issues: 4,
      status: 'warning'
    },
    {
      id: 3,
      name: "MEP",
      color: "bg-orange-500",
      fileScope: "MEP_*",
      emailList: ["mep@contractor.com"],
      dueDate: "2024-06-05",
      filesChecked: 28,
      filesPassed: 25,
      issues: 3,
      status: 'overdue'
    }
  ]);

  const [newDiscipline, setNewDiscipline] = useState({
    name: "",
    color: "bg-blue-500",
    fileScope: "",
    emailList: "",
    dueDate: ""
  });

  const [isAddingDiscipline, setIsAddingDiscipline] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'on-track': 'bg-green-100 text-green-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const handleAddDiscipline = () => {
    if (newDiscipline.name && newDiscipline.fileScope && newDiscipline.dueDate) {
      const discipline: Discipline = {
        id: disciplines.length + 1,
        name: newDiscipline.name,
        color: newDiscipline.color,
        fileScope: newDiscipline.fileScope,
        emailList: newDiscipline.emailList.split(',').map(email => email.trim()),
        dueDate: newDiscipline.dueDate,
        filesChecked: 0,
        filesPassed: 0,
        issues: 0,
        status: 'on-track'
      };
      setDisciplines([...disciplines, discipline]);
      setNewDiscipline({ name: "", color: "bg-blue-500", fileScope: "", emailList: "", dueDate: "" });
      setIsAddingDiscipline(false);
    }
  };

  const calculatePassRate = (passed: number, total: number) => {
    return total > 0 ? Math.round((passed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Discipline Overview</h3>
          <p className="text-gray-600 mt-1">Manage validation disciplines for {projectName}</p>
        </div>
        <Dialog open={isAddingDiscipline} onOpenChange={setIsAddingDiscipline}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Discipline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Discipline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="disciplineName">Discipline Name</Label>
                <Input
                  id="disciplineName"
                  value={newDiscipline.name}
                  onChange={(e) => setNewDiscipline({...newDiscipline, name: e.target.value})}
                  placeholder="e.g. Architecture, MEP, Structure"
                />
              </div>
              <div>
                <Label htmlFor="disciplineColor">Color Tag</Label>
                <Select 
                  value={newDiscipline.color}
                  onValueChange={(value) => setNewDiscipline({...newDiscipline, color: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-orange-500">Orange</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fileScope">File Validation Scope</Label>
                <Input
                  id="fileScope"
                  value={newDiscipline.fileScope}
                  onChange={(e) => setNewDiscipline({...newDiscipline, fileScope: e.target.value})}
                  placeholder="e.g. ARCH_*, MEP_*"
                />
              </div>
              <div>
                <Label htmlFor="emailList">Team Email List</Label>
                <Textarea
                  id="emailList"
                  value={newDiscipline.emailList}
                  onChange={(e) => setNewDiscipline({...newDiscipline, emailList: e.target.value})}
                  placeholder="team@contractor.com, lead@contractor.com"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Next Deliverable Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDiscipline.dueDate}
                  onChange={(e) => setNewDiscipline({...newDiscipline, dueDate: e.target.value})}
                />
              </div>
              <Button onClick={handleAddDiscipline} className="w-full bg-green-600 hover:bg-green-700">
                Add Discipline
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Disciplines Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Discipline</TableHead>
                <TableHead>Files Checked</TableHead>
                <TableHead>Pass Rate</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disciplines.map((discipline) => (
                <TableRow key={discipline.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${discipline.color}`}></div>
                      <span className="font-medium">{discipline.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{discipline.filesChecked} files</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{calculatePassRate(discipline.filesPassed, discipline.filesChecked)}%</span>
                      <span className="text-sm text-gray-500">
                        ({discipline.filesPassed}/{discipline.filesChecked})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {discipline.issues > 0 ? (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {discipline.issues} issues
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">No issues</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(discipline.status)}
                      {getStatusBadge(discipline.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {discipline.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
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
