
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, FolderOpen, Calendar, ChevronDown, Users, Mail } from "lucide-react";
import { DisciplineManagement } from "./DisciplineManagement";

export const ProjectsTab = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Office Building A - Phase 1",
      status: "active",
      lastUpdated: "2024-05-28",
      filesCount: 245,
      pmEmail: "pm@contractor.com",
      disciplineCount: 3,
      overallPassRate: 92
    },
    {
      id: 2,
      name: "Residential Complex B",
      status: "active",
      lastUpdated: "2024-05-27",
      filesCount: 189,
      pmEmail: "pm2@contractor.com",
      disciplineCount: 2,
      overallPassRate: 88
    },
    {
      id: 3,
      name: "Infrastructure Project C",
      status: "archived",
      lastUpdated: "2024-05-20",
      filesCount: 156,
      pmEmail: "pm3@contractor.com",
      disciplineCount: 4,
      overallPassRate: 95
    },
    {
      id: 4,
      name: "Shopping Mall Development",
      status: "active",
      lastUpdated: "2024-05-26",
      filesCount: 312,
      pmEmail: "pm4@contractor.com",
      disciplineCount: 5,
      overallPassRate: 89
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    namingStandard: "",
    pmEmail: ""
  });

  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  const handleCreateProject = () => {
    if (newProject.name && newProject.pmEmail) {
      const project = {
        id: projects.length + 1,
        name: newProject.name,
        status: "active",
        lastUpdated: new Date().toISOString().split('T')[0],
        filesCount: 0,
        pmEmail: newProject.pmEmail,
        disciplineCount: 0,
        overallPassRate: 0
      };
      setProjects([...projects, project]);
      setNewProject({ name: "", namingStandard: "", pmEmail: "" });
    }
  };

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="pmEmail">Project Manager Email</Label>
                <Input
                  id="pmEmail"
                  type="email"
                  value={newProject.pmEmail}
                  onChange={(e) => setNewProject({...newProject, pmEmail: e.target.value})}
                  placeholder="pm@contractor.com"
                />
              </div>
              <div>
                <Label htmlFor="namingStandard">Default Naming Standard</Label>
                <Select 
                  value={newProject.namingStandard}
                  onValueChange={(value) => setNewProject({...newProject, namingStandard: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select naming standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cad-standard">CAD Drawing Standard v2.1</SelectItem>
                    <SelectItem value="doc-control">Document Control Standard</SelectItem>
                    <SelectItem value="tech-specs">Technical Specifications</SelectItem>
                    <SelectItem value="qa-standard">Quality Assurance Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateProject} className="w-full bg-green-600 hover:bg-green-700">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
            <Collapsible>
              <CollapsibleTrigger
                onClick={() => toggleProjectExpansion(project.id)}
                className="w-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                          {project.name}
                        </CardTitle>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          expandedProjects.includes(project.id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge
                          variant={project.status === "active" ? "default" : "secondary"}
                          className={project.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {project.status}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {project.disciplineCount} disciplines
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-1" />
                          {project.pmEmail}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        project.overallPassRate >= 95 ? 'bg-green-100 text-green-800' :
                        project.overallPassRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {project.overallPassRate}% pass rate
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last updated: {project.lastUpdated}
                    </div>
                    <div className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {project.filesCount} files
                    </div>
                  </div>
                  <Button variant="outline">
                    Open Project
                  </Button>
                </div>

                <CollapsibleContent className="mt-4">
                  <div className="border-t pt-4">
                    <DisciplineManagement 
                      projectId={project.id} 
                      projectName={project.name} 
                    />
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};
